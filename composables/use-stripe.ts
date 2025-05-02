import Stripe from 'stripe';
import type { LanguageOptions } from '~/utils/constants/languages';

let stripe: Stripe;

const useStripe = () => {
  const runtime = useRuntimeConfig();

  const { stripeSecretKey } = runtime;
  const { stripePaymentLink } = runtime.public;

  if (!stripe && import.meta.server && stripeSecretKey) {
    stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-08-16' });
  }

  const getSubscription = async (subscriptionId: string) => {
    return stripe.subscriptions.retrieve(subscriptionId).then((subscription) => ({
      id: subscription.id,
      customerId: subscription.customer,
      status: subscription.status,
    }));
  };

  const getCheckout = async (checkoutId: string) => {
    return stripe.checkout.sessions.retrieve(checkoutId);
  };

  /**
   * client methods
   */
  const clientGetCheckoutValid = (checkoutId: string) => {
    return $fetch<{ email: string; name: string }>('/api/getCheckoutValid', { method: 'post', body: { checkoutId } });
  };

  function goToStripeSubscriptionPage(urlParams: { prefilled_email?: string; locale?: LanguageOptions } = {}) {
    const params = new URLSearchParams(urlParams);
    window.open(`${stripePaymentLink}${params ? '?' + params : ''}`, '_blank');
  }

  return { stripe, getSubscription, getCheckout, clientGetCheckoutValid, goToStripeSubscriptionPage };
};
export default useStripe;
