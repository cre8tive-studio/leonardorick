/**
 * SENTRY SERVER SIDE CONFIGURATION
 * setup done following this guide: https://www.lichter.io/articles/nuxt3-sentry-recipe/
 */
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { isProduction } from '~/utils/js-utilities';

export default defineNitroPlugin((nitroApp) => {
  const {
    public: { environment, sentry },
  } = useRuntimeConfig();

  // If no sentry DSN set, ignore
  if (!sentry.dsn) {
    return;
  }

  // Initialize Sentry
  if (isProduction(environment)) {
    Sentry.init({
      dsn: sentry.dsn,
      environment,
      integrations: [new ProfilingIntegration()],
      // Performance Monitoring
      // Change to 1.0 when testing
      tracesSampleRate: 0.2,
      profilesSampleRate: 0.2,
    });

    nitroApp.hooks.hook('request', (event) => {
      event.context.$sentry = Sentry;
    });

    // Here comes the hooks
    nitroApp.hooks.hook('error', (error) => {
      Sentry.captureException(error);
    });

    nitroApp.hooks.hookOnce('close', async () => {
      await Sentry.close(2000);
    });
  }
});
