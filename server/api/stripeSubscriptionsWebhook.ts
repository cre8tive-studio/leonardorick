import Stripe from 'stripe';
import { ID } from 'node-appwrite';

import type { StripeInvoceObjectModel } from '../types/stripe-invoice-object.model';
import useServerAppwrite from '~/composables/use-server-appwrite';
import useStripe from '~/composables/use-stripe';
import { incrementAvailableDemos } from '~/utils/music';

const {
  databases,
  databaseId,
  collections,
  queryAllowedEmail,
  getUserWithEmail,
  getSettings,
  getUser,
} = useServerAppwrite();

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

  try {
    const allowedEmail = await queryAllowedEmail(customerEmail);
    // if allowed email don't exists we create this reference
    // so we can allow user to signup later
    if (!allowedEmail) {
      return databases.createDocument(databaseId, collections.allowedEmails, ID.unique(), {
        email: customerEmail,
        name: customerName,
        stripeId: customer,
        subscriptionId: subscription,
        availableDemos: await getAvailableDemos(subscription, true),
      });
    }

    // is allowed email already exists it means that i'ts a recurrent payment
    // and we need to update the user with the new number of available demos
    const { $id } = (await getUserWithEmail(customerEmail)) || {};

    if ($id) {
      return databases.updateDocument(databaseId, collections.users, $id, {
        stripeId: customer,
        subscriptionId: subscription,
        availableDemos: await getAvailableDemos(subscription, false, $id),
      });
    }
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode,
      statusMessage: err.message,
    });
  }
});

const getAvailableDemos = async (subscription: string, creating: boolean, userId?: string) => {
  const { availableDemosCount, startDemosCount } = await getSettings();
  let limit = startDemosCount;
  let previous: number[] = [];
  if (!creating && userId) {
    limit += (await stripe.invoices.list({ status: 'paid', subscription })).data.length - 1;
    ({ availableDemos: previous } = await getUser(userId));
  }
  return incrementAvailableDemos({ total: availableDemosCount, previous, limit });
};
