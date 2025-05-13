import Stripe from 'stripe';
import { ID } from 'node-appwrite';

import useServerAppwrite from '~/composables/use-server-appwrite';
import useStripe from '~/composables/use-stripe';
import { incrementAvailablePreviews } from '~/utils/music';
import type { AppwriteUserModel } from '~/types/user.model';
import type { AppwriteSettingsModel, SettingsModel } from '~/types/settings.model';

const { databases, databaseId, collections, documents, queryAllowedEmail, getUserWithEmail, getSettings, getUser } =
  useServerAppwrite();

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

  const invoice = event.data.object;
  const { customer_email: customerEmail, customer_name: customerName, customer, subscription } = invoice;

  // *********** check created variables exists *************
  if (!customerEmail || !customer) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing data: customer and Email',
    });
  }

  if (!subscription || typeof subscription !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing data: subscription',
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

  try {
    const settings = await getSettings();

    // *************** update moeny count only in livemode (not test data) ***************
    if (invoice.livemode) {
      const { savedAmount, moneyTarget } = settings;

      if (savedAmount < moneyTarget) {
        databases.updateDocument<AppwriteSettingsModel>(databaseId, collections.settings, documents.settings, {
          savedAmount: getTotalSavedAmount(savedAmount, invoice.amount_paid),
        });
      }
    }

    // *********** create allowed-emails reference if doesn't exists yet *************
    const allowedEmail = await queryAllowedEmail(customerEmail);
    // if allowed email don't exists we create this reference
    // so we can allow user to signup later
    if (!allowedEmail) {
      return databases.createDocument(databaseId, collections.allowedEmails, ID.unique(), {
        email: customerEmail,
        name: customerName,
        stripeId: customer,
        subscriptionId: subscription,
        availablePreviews: await getavailablePreviews(subscription, settings),
      });
    }

    // *********** from here to bottom it's not the first payment *************

    const isReSubscription = allowedEmail.subscriptionId !== subscription;
    if (isReSubscription) {
      databases.updateDocument(databaseId, collections.allowedEmails, allowedEmail.$id, {
        subscriptionId: subscription,
      });
    }

    // is allowed email already exists it means that i'ts a recurrent payment
    // and we need to update the user with the new number of available previews
    const { $id, availablePreviews } = (await getUserWithEmail(customerEmail)) || {};
    const newAvailablePreviews = await getavailablePreviews(subscription, settings, $id);
    if ($id) {
      return databases.updateDocument<AppwriteUserModel>(databaseId, collections.users, $id, {
        stripeId: customer,
        subscriptionId: subscription,
        availablePreviews: newAvailablePreviews,
        featuredPreviews: getfeaturedPreviews(availablePreviews, newAvailablePreviews),
      });
    }
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode,
      statusMessage: err.message,
    });
  }
});

const getTotalSavedAmount = (previousSavedAmount: number, amountPaid: number) => {
  const savedAmountInCents = Math.round(previousSavedAmount * 100);
  const paidAmountInCents = amountPaid;
  const totalInCents = savedAmountInCents + paidAmountInCents;
  return totalInCents / 100;
};

// used so we can add the featured banner
const getfeaturedPreviews = (previousList: number[], currentList: number[]) => {
  return currentList.filter((item) => !previousList.includes(item)) || [];
};

// ? don't send the user id on creation so we count paid invoices properly
const getavailablePreviews = async (subscription: string, settings: SettingsModel, userId?: string) => {
  const { startPreviewsCount, previewsReady } = settings;
  let previous: number[] = [];
  let paidInvoicesCount = 0;
  if (userId) {
    paidInvoicesCount += (await stripe.invoices.list({ status: 'paid', subscription })).data.length;
    ({ availablePreviews: previous } = await getUser(userId));
  }
  return incrementAvailablePreviews({ previous, paidInvoicesCount, startPreviewsCount, previewsReady });
};
