import express from "express";
import Stripe from "stripe";

const router = express.Router();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-10-29.clover",
});

// Webhook endpoint needs raw body for signature verification
// This must be registered BEFORE the main Express JSON middleware
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    if (!sig) {
      console.error("❌ No stripe-signature header found");
      return res.status(400).send("No signature");
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("❌ STRIPE_WEBHOOK_SECRET not configured");
      return res.status(500).send("Webhook secret not configured");
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    console.log(`✅ Received webhook event: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("💳 Payment completed:", {
          sessionId: session.id,
          customerId: session.customer,
          subscriptionId: session.subscription,
          customerEmail: session.customer_email,
          metadata: session.metadata,
        });

        // NOTE: Firestore premium status update for production
        // To implement server-side premium status updates:
        // 1. Install Firebase Admin SDK: npm install firebase-admin
        // 2. Initialize with service account credentials
        // 3. Update user document: admin.firestore().doc(`users/${metadata.userId}`).update({premium: true})
        // 
        // For MVP, premium status is updated client-side in Success.tsx after session verification
        
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("🔄 Subscription updated:", {
          subscriptionId: subscription.id,
          status: subscription.status,
          customerId: subscription.customer,
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("❌ Subscription cancelled:", {
          subscriptionId: subscription.id,
          customerId: subscription.customer,
        });
        // TODO: Revoke premium access in Firestore
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  }
);

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("Stripe payment intent error:", error);
    res.status(500).json({ 
      message: "Error creating payment intent: " + error.message 
    });
  }
});

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl, userId, userEmail } = req.body;
    
    // Build session config with optional email and 7-day free trial
    const sessionConfig: any = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.origin}/premium`,
      metadata: {
        userId: userId || "anonymous",
      },
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          userId: userId || "anonymous",
        },
      },
    };

    // Only include customer_email if valid email provided
    if (userEmail && userEmail.includes('@')) {
      sessionConfig.customer_email = userEmail;
    }
    
    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error("Stripe checkout session error:", error);
    res.status(500).json({ 
      message: "Error creating checkout session: " + error.message 
    });
  }
});

// Endpoint to verify session and get subscription details
router.get("/checkout-session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    res.json({
      status: session.status,
      customerEmail: session.customer_email,
      subscriptionId: session.subscription,
      metadata: session.metadata,
    });
  } catch (error: any) {
    console.error("Error retrieving checkout session:", error);
    res.status(500).json({ 
      message: "Error retrieving session: " + error.message 
    });
  }
});

export default router;
