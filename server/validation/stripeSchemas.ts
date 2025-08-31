import { z } from 'zod';

// Schema for a Stripe Price object, often expanded with a Product
export const StripePriceSchema = z.object({
  id: z.string(),
  unit_amount: z.number().nullable(),
  currency: z.string(),
});

// Schema for a Stripe Product object
export const StripeProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  active: z.boolean(),
  default_price: StripePriceSchema.nullable(),
});

// Schema for the /products endpoint response
export const ProductListResponseSchema = z.array(StripeProductSchema);

// Schema for a Stripe Subscription object
export const StripeSubscriptionSchema = z.object({
  id: z.string(),
  status: z.string(),
  user_id: z.string(),
  stripe_customer_id: z.string(),
  stripe_subscription_id: z.string().nullable(),
  stripe_price_id: z.string().nullable(),
  // Add other fields from your 'subscriptions' table as needed
});

// Schema for the 'checkout.session.completed' event data object
export const CheckoutSessionCompletedSchema = z.object({
  id: z.string(),
  metadata: z.object({
    userId: z.string(),
  }).nullable(),
  subscription: z.string().nullable(),
});

// Schema for the 'customer.subscription.updated' and 'deleted' event data object
export const CustomerSubscriptionSchema = z.object({
  id: z.string(),
  status: z.string(),
  customer: z.string(),
  items: z.object({
    data: z.array(z.object({
      price: z.object({
        id: z.string(),
      }),
    })),
  }),
  current_period_start: z.number(),
  current_period_end: z.number(),
  cancel_at_period_end: z.boolean(),
});
