import { AUTHENTICATED_URLS, DYNAMIC_AUTHENTICATED_URLS } from '../utils/authenticated-urls';
import { createGenericError } from '../utils/errors';
import type { Auth } from '~/types/auth.model';
import useServerAppwrite from '~/composables/use-server-appwrite';

const { getLimitedAccount } = useServerAppwrite();
export default defineEventHandler(async (event) => {
  const { url } = event.node.req;

  let auth: Auth = {
    authenticated: false,
    userId: '',
    jwt: '',
  };

  if (url && urlShouldBeAuthenticated(url)) {
    const jwt = event.node.req.headers.authorization;
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
