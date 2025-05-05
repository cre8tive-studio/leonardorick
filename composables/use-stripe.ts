import Stripe from 'stripe';
import type { SubscriptionModel } from '~/types/subscription.model';
import type { LanguageOptions } from '~/utils/constants/languages';

let stripe: Stripe;

const useStripe = () => {
  const runtime = useRuntimeConfig();
  let stripeSecretKey;

  if (import.meta.server) {
    ({ stripeSecretKey } = runtime);
  }

  const { stripePaymentLink, stripeClientPortalLink } = runtime.public;

  if (!stripe && stripeSecretKey) {
    stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-08-16' });
  }

  // ? Since appwrite don't allow canceled subscriptions to be re-enabled in Customer Portal we need to do it manually
  const renewSubscription = async (customerId: string) => {
    const prices = await stripe.prices.list({ active: true, limit: 1 });
    const paymentMethods = await stripe.paymentMethods.list({ customer: customerId });

    const priceId = prices.data[0]?.id;
    const paymentMethod = paymentMethods.data[0]?.id;
    return stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
        },
      ],
      trial_period_days: 0,
      default_payment_method: paymentMethod,
    });
  };

  const getSubscription = async (subscriptionId: string) => {
    return stripe.subscriptions.retrieve(subscriptionId).then(
      (subscription) =>
        ({
          id: subscription.id,
          customerId: subscription.customer,
          status: subscription.status,
          cancel_at: subscription.cancel_at,
          cancel_at_period_end: subscription.cancel_at_period_end,
        } as SubscriptionModel)
    );
  };

  const getCheckout = async (checkoutId: string) => {
    return stripe.checkout.sessions.retrieve(checkoutId);
  };

  /**
   * * client methods
   */

  async function clientRenewSubscription() {
    return useRequest().request('/api/renewSubscription', { authenticated: true });
  }

  function clientGetCheckoutValid(checkoutId: string) {
    return $fetch<{ email: string; name: string }>('/api/getCheckoutValid', { method: 'post', body: { checkoutId } });
  }

  function goToStripeSubscriptionPage(urlParams: { prefilled_email?: string; locale?: LanguageOptions } = {}) {
    const params = new URLSearchParams(urlParams);
    window.open(`${stripePaymentLink}${params ? '?' + params : ''}`, '_blank');
  }

  function goToStripeClientPortal(urlParams: { prefilled_email?: string; locale?: LanguageOptions } = {}) {
    const params = new URLSearchParams(urlParams);
    window.open(`${stripeClientPortalLink}${params ? '?' + params : ''}`);
  }

  return {
    stripe,
    getSubscription,
    getCheckout,
    renewSubscription,
    clientGetCheckoutValid,
    clientRenewSubscription,
    goToStripeSubscriptionPage,
    goToStripeClientPortal,
  };
};
export default useStripe;
