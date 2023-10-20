import useStripe from '~/composables/use-stripe';

const stripe = useStripe();

export default defineEventHandler(async (event) => {
  const { subscriptionId } = await readBody(event);
  return stripe.subscriptions.retrieve(subscriptionId).then((subscription) => ({
    id: subscription.id,
    customerId: subscription.customer,
    status: subscription.status,
  }));
});
