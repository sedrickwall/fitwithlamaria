import { BottomNav } from "@/components/BottomNav";
import { BackHeader } from "@/components/BackHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      question: "How does Fit with LaMaria work?",
      answer: "Fit with LaMaria combines daily workout videos with brain-boosting word puzzles. Complete a workout to unlock today's puzzle. Track your progress, build streaks, and earn points as you stay active and sharp!",
    },
    {
      question: "Do I need to subscribe to use the app?",
      answer: "You can explore the app for free, but a Premium subscription unlocks unlimited workouts, all puzzles, and access to our Community features. Try it free for 7 days!",
    },
    {
      question: "What exercises are included?",
      answer: "We offer gentle, effective workouts designed for active 55+, including seated exercises, standing routines, and balance training. All led by certified instructors.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes! You can cancel your subscription at any time. There are no long-term commitments, and you can manage your subscription directly from your account.",
    },
    {
      question: "How do streaks work?",
      answer: "Complete both a workout and a puzzle on the same day to build your streak. The longer your streak, the more bonus points you earn!",
    },
    {
      question: "What are the puzzle types?",
      answer: "We offer alternating Wordle-style word games and Word Search puzzles, with progressive difficulty that scales from 5 to 7 letters as you improve.",
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use Firebase for secure authentication and encrypted data storage. Your privacy and security are our top priorities.",
    },
    {
      question: "Can I access this on my phone and tablet?",
      answer: "Yes! Fit with LaMaria works on any device with a web browser - phone, tablet, or computer. Your progress syncs across all devices.",
    },
  ];

  const { swipeHandlers, HeaderComponent } = BackHeader({
    title: "Frequently Asked Questions",
    subtitle: "Get answers to common questions about Fit with LaMaria",
  });

  return (
    <div 
      className="min-h-screen bg-background pb-24"
      {...swipeHandlers}
    >
      <div className="max-w-3xl mx-auto px-6 py-8">
        {HeaderComponent}

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border-2 border-border rounded-lg px-6"
              data-testid={`faq-item-${index}`}
            >
              <AccordionTrigger className="text-left text-body-lg font-semibold hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-body-md text-muted-foreground pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-8 text-center">
          <h2 className="text-h3 font-bold text-foreground mb-4">Still have questions?</h2>
          <p className="text-body-lg text-muted-foreground mb-6">
            We're here to help! Contact our support team for personalized assistance.
          </p>
          <a
            href="mailto:support@fitwithlamaria.com"
            className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            data-testid="link-contact-support"
          >
            Contact Support
          </a>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
