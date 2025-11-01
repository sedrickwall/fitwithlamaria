import { useState, useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, Crown, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { apiRequest } from "@/lib/queryClient";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full h-14 text-lg"
        data-testid="button-submit-payment"
      >
        {isProcessing ? "Processing..." : "Subscribe Now"}
      </Button>
    </form>
  );
};

const CheckoutPage = ({ amount }: { amount: number }) => {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest("POST", "/api/stripe/create-payment-intent", { amount })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error creating payment intent:", error);
        setLoading(false);
      });
  }, [amount]);

  if (loading || !clientSecret) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  );
};

export default function Premium() {
  const { profile } = useUserProfile();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");
  const totalPoints = profile?.totalPoints || 0;

  const handleUpgrade = async (planType: "monthly" | "yearly") => {
    try {
      // Use environment variables for price IDs
      const priceId = planType === "monthly" 
        ? import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID 
        : import.meta.env.VITE_STRIPE_YEARLY_PRICE_ID;

      if (!priceId) {
        toast({
          title: "Configuration Error",
          description: "Payment system is not fully configured. Please contact support.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/premium`,
          userId: user?.uid || profile?.id || "anonymous",
          userEmail: user?.email || "",
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Error",
        description: "Unable to start checkout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const features = [
    { icon: Crown, text: "Unlimited daily workouts" },
    { icon: Zap, text: "Access to all puzzle types" },
    { icon: Sparkles, text: "Exclusive premium content" },
    { icon: Check, text: "Priority support" },
    { icon: Check, text: "Ad-free experience" },
    { icon: Check, text: "Progress analytics" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopBar points={totalPoints} />
      
      <main className="max-w-4xl mx-auto px-6 md:px-8 py-8 pb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-h1 font-bold mb-4">Upgrade to Premium</h1>
          <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock the full FitWord experience with unlimited access to workouts, puzzles, and exclusive features.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-h3">Monthly</CardTitle>
              <CardDescription>Pay month-to-month</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$4.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <li key={index} className="flex items-start gap-2">
                      <Icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature.text}</span>
                    </li>
                  );
                })}
              </ul>
              
              <Button 
                onClick={() => handleUpgrade("monthly")}
                className="w-full h-14 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                data-testid="button-upgrade-monthly"
              >
                <Crown className="w-5 h-5 mr-2" />
                Subscribe Monthly
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Billed monthly • Cancel anytime
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-br from-green-500 to-emerald-500 text-white px-4 py-1 text-sm font-semibold">
              Best Value
            </div>
            <CardHeader>
              <CardTitle className="text-h3">Yearly</CardTitle>
              <CardDescription>Save $10.88 per year</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-muted-foreground">/year</span>
              </div>
              <p className="text-sm text-success font-medium">
                Only $4.08/month
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <li key={index} className="flex items-start gap-2">
                      <Icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature.text}</span>
                    </li>
                  );
                })}
              </ul>
              
              <Button 
                onClick={() => handleUpgrade("yearly")}
                className="w-full h-14 text-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                data-testid="button-upgrade-yearly"
              >
                <Crown className="w-5 h-5 mr-2" />
                Subscribe Yearly
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                One-time yearly payment • Best value
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Cancel anytime. No hidden fees. Secure payment powered by Stripe.</p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
