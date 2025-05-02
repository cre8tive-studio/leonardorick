import useStripe from '~/composables/use-stripe';

const { getCheckout } = useStripe();

export default defineEventHandler(async (event) => {
  const { checkoutId } = await readBody(event);
  const checkout = await getCheckout(checkoutId);

  if (checkout.payment_status !== 'paid' || checkout.status !== 'complete' || !checkout.customer_details) {
    throw createError({ statusCode: 400, message: 'Invalid checkout status' });
  }

  return { email: checkout.customer_details.email, name: checkout.customer_details.name };
});
