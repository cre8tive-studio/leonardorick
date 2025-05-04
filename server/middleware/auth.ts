import {
  AUTHENTICATED_URLS,
  AUTHENTICATED_WITHTOUT_SUBSCRIPTION_URLS,
  DYNAMIC_AUTHENTICATED_URLS,
} from '../utils/authenticated-urls';
import { createGenericError } from '../utils/errors';
import type { Auth } from '~/types/auth.model';
import useServerAppwrite from '~/composables/use-server-appwrite';
import useStripe from '~/composables/use-stripe';
import { SubscriptionModel } from '~/types/subscription.model';

const { getLimitedAccount } = useServerAppwrite();
const { getSubscription } = useStripe();

export default defineEventHandler(async (event) => {
  const { url } = event.node.req;

  let auth: Auth = {
    authenticated: false,
    userId: '',
    jwt: '',
  };

  let subscription: SubscriptionModel = {
    id: '',
    customerId: '',
    status: 'incomplete',
    cancel_at: null,
    cancel_at_period_end: false,
  };

  if (url && urlShouldBeAuthenticated(url)) {
    const jwt = event.node.req.headers.authorization;
    const subscriptionId = event.node.req.headers['x-subscription-id'] as string;

    if (!AUTHENTICATED_WITHTOUT_SUBSCRIPTION_URLS.has(url)) {
      if (!subscriptionId) {
        throw createGenericError('Missing required header for authenticated requests: X-Subscription-ID');
      }

      subscription = await getSubscription(subscriptionId);

      if (subscription.status !== 'active') {
        throw createGenericError('Subscription not active');
      }
    }

    if (jwt) {
      const account = getLimitedAccount(jwt);
      auth = await account
        .get()
        .then((res) => ({ authenticated: true, userId: res.$id, jwt }))
        .catch(() => {
          throw createGenericError('User unauthenticated');
        });
    }
  }
  event.context.auth = auth;
  event.context.subscription = subscription;
});

function urlShouldBeAuthenticated(url: string) {
  return (
    AUTHENTICATED_URLS.has(url) ||
    // url will be dynamic if it contains a slash after removing the /api/ prefix. If it is dynamic
    // check if the url contains the constand part of some dynamic url predefined as authenticated
    (url.replace('/api/', '').includes('/') &&
      DYNAMIC_AUTHENTICATED_URLS.some((u) => {
        const path = u as string;
        return url.includes(path.replace(/:.+/g, ''));
      }))
  );
}
