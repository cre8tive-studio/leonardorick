/**
 * SENTRY CLIENT SIDE CONFIGURATION
 * setup done following this guide: https://www.lichter.io/articles/nuxt3-sentry-recipe/
 */
import * as Sentry from '@sentry/vue';

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();
  const {
    public: { baseUrl, environment, sentry },
  } = useRuntimeConfig();

  // If no sentry DSN set, ignore
  if (!sentry.dsn) {
    return;
  }

  if (isProduction(environment)) {
    Sentry.init({
      debug: false,
      app: nuxtApp.vueApp,
      dsn: sentry.dsn,
      environment,
      integrations: [
        new Sentry.BrowserTracing({
          routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        }),
        new Sentry.Replay(),
      ],
      // Change all to 1.0 when testing
      tracesSampleRate: 0.2,
      replaysSessionSampleRate: 0.2,
      replaysOnErrorSampleRate: 0.5,
      // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ['localhost', baseUrl],
    });
  }
});
