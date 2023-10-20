import Stripe from 'stripe';

let stripe: Stripe;

const useStripe = () => {
  const { stripeSecretKey } = useRuntimeConfig();
  if (!stripe) {
    stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-08-16' });
  }

  const getSubscription = async (subscriptionId: string) => {
    return stripe.subscriptions.retrieve(subscriptionId).then((subscription) => ({
      id: subscription.id,
      customerId: subscription.customer,
      status: subscription.status,
    }));
  };
  return { stripe, getSubscription };
};
export default useStripe;
