import Stripe from 'stripe';
import { ID } from 'node-appwrite';

import type { StripeInvoceObjectModel } from '../types/stripe-invoice-object.model';
import useServerAuth from '~/composables/use-server-auth';
import useStripe from '~/composables/use-stripe';

const { databases, database, collections, queryAllowedEmail, getUserWithEmail } = useServerAuth();
const { stripe, getSubscription } = useStripe();

// this webhook is called by stripe when a payment is made. It runs monthly
// and is settle to run after all Stripe payment.succeeded events that happens.
export default defineEventHandler(async (nuxtEvent) => {
  const e: Stripe.Event = await readBody(nuxtEvent);
  let event: Stripe.Event;

  // ******************* firewall *******************
  try {
    // use the recevied event id to call stripe api and check if info is valid
    event = await stripe.events.retrieve(e.id);
  } catch (err: any) {
    throw createError({
      statusCode: 404,
      statusMessage: err.message,
    });
  }

  // ************* check event type ***************
  if (event.type !== 'invoice.payment_succeeded') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Event out of scope. track a valid event: invoice.payment_succeeded',
    });
  }

  // ************* check all variables exists **************
  if (!event || !event.data || !event.data.object) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing data',
    });
  }

  const invoice = event.data.object as StripeInvoceObjectModel;
  const {
    customer_email: customerEmail,
    customer_name: customerName,
    customer,
    subscription,
  } = invoice;

  // *********** check created variables exists *************
  if (!customerEmail || !customer) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing data',
    });
  }

  // *********** check if subscription is active *************
  const sub = await getSubscription(subscription);

  if (!sub || sub.status !== 'active') {
    throw createError({
      statusCode: 403,
      statusMessage: `Subscription is not active. Current status: ${sub.status}`,
    });
  }

  // *********** create allowed-emails reference if doesn't exists yet *************
  const allowedEmail = await queryAllowedEmail(customerEmail);
  if (!allowedEmail) {
    return databases.createDocument(database, collections.allowedEmails, ID.unique(), {
      email: customerEmail,
      name: customerName,
      stripeId: customer,
      subscriptionId: subscription,
    });
  }

  // todo: check if we need to update something on user when email is already there on allowed-emails
  // const { $id } = await getUserWithEmail(customerEmail);
  // if ($id) {
  //   return databases.updateDocument(database, collections.users, $id, {
  //     stripeId: customer,
  //     subscriptionId: subscription,
  //   });
  // }
  return allowedEmail;
});
