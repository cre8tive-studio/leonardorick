import { AUTHENTICATED_URLS } from '../utils/authenticated-urls';
import useServerAppwrite from '~/composables/use-server-appwrite';

interface Auth {
  authenticated: boolean;
  userId: string;
  jwt: string;
}

const { getLimitedAccount } = useServerAppwrite();
export default defineEventHandler(async (event) => {
  const { url } = event.node.req;

  let auth: Auth = {
    authenticated: false,
    userId: '',
    jwt: '',
  };

  if (url && AUTHENTICATED_URLS.has(url)) {
    const jwt = event.node.req.headers.authorization;
    if (jwt) {
      const account = getLimitedAccount(jwt);
      auth = await account
        .get()
        .then((res) => ({ authenticated: true, userId: res.$id, jwt }))
        .catch(() => {
          throw create403Error('User unauthenticated');
        });
    }
  }
  event.context.auth = auth;
});
