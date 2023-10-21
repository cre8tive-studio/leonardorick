import useStripe from '~/composables/use-stripe';

const { getSubscription } = useStripe();

export default defineEventHandler(async (event) => {
  const { subscriptionId } = await readBody(event);
  return getSubscription(subscriptionId);
});
