import type { Stripe } from 'stripe';

export interface SubscriptionModel {
  id: string;
  customerId: string;
  status: Stripe.Subscription.Status;
  cancel_at: number | null;
  cancel_at_period_end: boolean;
}
