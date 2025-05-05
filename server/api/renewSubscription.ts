import useServerAppwrite from '~/composables/use-server-appwrite';
import useStripe from '~/composables/use-stripe';

const { getUser, updateUser } = useServerAppwrite();
const { renewSubscription, getSubscription } = useStripe();

export default defineEventHandler(async (event) => {
  if (!event.context.auth) {
    throw createGenericError('Request require authentication');
  }
  const { userId } = event.context.auth;

  if (!userId) {
    throw createGenericError('User not allowed');
  }
  const user = await getUser(userId);

  const sub = await getSubscription(user.subscriptionId);

  // *********** check if subscription is already active *************
  if (sub && sub.status === 'active') {
    throw createError({
      statusCode: 403,
      data: {
        code: 'subscription_already_exists',
      },
      statusMessage: 'Subscription is already active. Theres no need to renew the subscription',
    });
  }

  try {
    const newSub = await renewSubscription(user.stripeId);
    // we need to update the user straight away so this endpoint can't be called twice
    await updateUser(userId, { subscriptionId: newSub.id });
    return newSub;
  } catch (e: any) {
    throw createError({
      statusCode: e.statusCode,
      statusMessage: e.message,
    });
  }
});
