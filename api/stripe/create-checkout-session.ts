import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, successUrl, cancelUrl, userId, userEmail } = req.body;
    
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.origin}/premium`,
      metadata: {
        userId: userId || 'anonymous',
      },
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          userId: userId || 'anonymous',
        },
      },
    };

    if (userEmail && userEmail.includes('@')) {
      sessionConfig.customer_email = userEmail;
    }
    
    const session = await stripe.checkout.sessions.create(sessionConfig);

    return res.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('Stripe checkout session error:', error);
    return res.status(500).json({ message: error.message });
  }
}
