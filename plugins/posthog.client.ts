import { posthog } from 'posthog-js';
import { defineNuxtPlugin } from '#app';
export default defineNuxtPlugin(() => {
  const c = useRuntimeConfig();
  const { publicKey, host } = c.public.posthog;
  const env = c.public.environment;

  if (!publicKey || !host) {
    if (isProduction(env)) {
      // eslint-disable-next-line no-console
      console.warn('Posthog not intialzed, missing configuration properties (key or url)');
    }
    return;
  }

  const posthogClient = posthog.init(publicKey, {
    api_host: host,
    loaded: (_pthog) => {
      _pthog.debug(false);
      if (import.meta.env.MODE === 'development') {
        // uncomment to see logs in dev
        // _pthog.debug();
      }
    },
  });

  // Make sure that pageviews are captured with each route change
  const router = useRouter();
  router.afterEach((to) => {
    posthog.capture('$pageview', {
      current_url: to.fullPath,
    });
  });

  return {
    provide: {
      posthog: () => posthogClient,
    },
  };
});
