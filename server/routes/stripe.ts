import { RequestHandler } from 'express';
import Stripe from 'stripe';
import { supabaseAdmin } from '../lib/supabaseAdmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', // Use the latest API version
});

export const createCheckoutSession: RequestHandler = async (req, res) => {
  const { priceId } = req.body;

  let userId;
  if (process.env.NODE_ENV === 'test') {
    userId = req.headers['x-mock-user-id'];
  } else {
    // @ts-ignore
    userId = req.user?.id;
  }

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!priceId) {
    return res.status(400).json({ error: 'Price ID is required' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.VITE_APP_URL}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_APP_URL}/subscription-cancelled`,
      client_reference_id: userId as string,
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

export const handleStripeWebhook: RequestHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, webhookSecret);
  } catch (err: any) {
    console.error(`Error verifying webhook signature: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      const subscriptionId = session.subscription;

      if (!userId || !subscriptionId) {
        console.error('Missing userId or subscriptionId in checkout session');
        return res.status(400).send('Webhook Error: Missing user or subscription ID');
      }

      const { error } = await supabaseAdmin
        .from('subscriptions')
        .upsert({
          user_id: userId,
          stripe_subscription_id: subscriptionId as string,
          status: 'active',
        }, { onConflict: 'user_id' });

      if (error) {
        console.error('Error upserting subscription:', error);
        return res.status(500).send('Webhook Error: Failed to update subscription');
      }

      console.log(`Subscription created/updated for user: ${userId}`);
      break;
    }
    // Add other event types here
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

export const getSubscription: RequestHandler = async (req, res) => {
  let userId;
  if (process.env.NODE_ENV === 'test') {
    userId = req.headers['x-mock-user-id'];
  } else {
    // @ts-ignore
    userId = req.user?.id;
  }

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { data: subscription, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = 'No rows found'
      throw error;
    }

    if (!subscription) {
      return res.json({ subscription: null });
    }

    res.json({ subscription });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
};
