// https://nuxt.com/docs/api/configuration/nuxt-config
import { HEAD } from './utils/analytics/head';
import pkg from './package.json';

const { NITRO_PRESET: preset, VUE_APP_BASE_URL: baseUrl } = process.env;

export default defineNuxtConfig({
  devtools: { enabled: false },
  future: {
    // todo remove this after nuxt 4 release
    compatibilityVersion: 4,
  },
  css: ['~/assets/css/_index.scss', '@fortawesome/fontawesome-svg-core/styles.css'],

  routeRules: {
    // redirects goes here
    // '/': { redirect: '/home'}
    '/test': { ssr: false },
  },
  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },
  runtimeConfig: {
    // Private env variables that is only available on the server
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    payloadGraphQLUrl: process.env.PAYLOAD_GRAPHQL_URL,
    appwrite: {
      apiKey: process.env.APPWRITE_SECRET_KEY,
      allowedEmailsCollection: process.env.APPWRITE_ALLOWED_EMAILS_COLLECTION,
      previewsCollection: process.env.APPWRITE_PREVIEWS_COLLECTION,
      coversCollection: process.env.APPWRITE_COVERS_COLLECTION,
      settingsDocument: process.env.VUE_APP_APPWRITE_SETTINGS_DOCUMENT,
      bucketId: process.env.APPWRITE_STORAGE,
    },
    // public env virables that are also available to client
    public: {
      environment: process.env.VUE_APP_ENVIRONMENT,
      stripePaymentLink: process.env.VUE_APP_STRIPE_PAYMENT_LINK,
      stripeClientPortalLink: process.env.VUE_APP_STRIPE_CLIENT_PORTAL_LINK,
      useMocks: process.env.USE_MOCKS,
      appwrite: {
        endpoint: process.env.VUE_APP_APPWRITE_ENDPOINT,
        project: process.env.VUE_APP_APPWRITE_PROJECT,
        usersCollection: process.env.VUE_APP_APPWRITE_USERS_COLLECTION,
        upvotesCollection: process.env.VUE_APP_APPWRITE_UPVOTES_COLLECTION,
        settingsCollection: process.env.VUE_APP_APPWRITE_SETTINGS_COLLECTION,
        releasesCollection: process.env.VUE_APP_APPWRITE_RELEASES_COLLECTION,
        settingsDocument: process.env.VUE_APP_APPWRITE_SETTINGS_DOCUMENT,
        databaseId: process.env.VUE_APP_APPWRITE_DATABASE,
      },
      sentry: {
        dsn: process.env.VUE_APP_SENTRY_DSN,
      },
      posthog: {
        publicKey: process.env.VUE_APP_POSTHOG_PUBLIC_KEY,
        host: process.env.VUE_APP_POSTHOG_HOST,
      },
      baseUrl,
      clientVersion: pkg.version,
    },
  },
  components: [
    {
      path: '~/components',
      // allow nested folders on components folder wihtout needing to
      //  rename components. The import will remain the component name only
      // and not consider the folders name
      pathPrefix: false,
    },
  ],
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@vue-macros/nuxt',
    '@nuxtjs/fontaine',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    'nuxt-svgo',
    '@nuxtjs/device',
    '@sentry/nuxt/module',
  ],
  // so we can identify which type of device the user is using
  // track deprecation warning: https://github.com/nuxt/nuxt/issues/29121
  device: {
    refreshOnResize: true,
  },
  pinia: {
    // some imports that are commonly used to be included automatically as nuxt do with much others
    autoImports: ['defineStore', ['defineStore', 'definePiniaStore']],
  },
  i18n: {
    vueI18n: './i18n.config.ts',
    locales: ['en', 'pt-BR'],
    strategy: 'no_prefix',
    // we disable it because it generates hydration errors. The server can't know the user language previously
    // so it's better to always load this as english to maintain consistency and then, if the user wants, he
    // will change the language to his preferred one
    detectBrowserLanguage: false,
    baseUrl,
    bundle: {
      optimizeTranslationDirective: false,
    },
  },
  sentry: {
    sourceMapsUploadOptions: {
      org: process.env.VUE_APP_SENTRY_ORG,
      project: process.env.VUE_APP_SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    },
  },
  image: {
    quality: 100,
    formats: ['webp'],
    provider: 'ipx',
    domains: ['https://res.cloudinary.com/', 'https://fra.cloud.appwrite.io/', 'https://appwrite.leonardorick.com'],
  },
  app: {
    head: HEAD.en.default,
  },
  vite: {
    assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.gif', '**/*.ico', '**/*.bin', '**/*.gltf', '**/*.glb'],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: "@use '@/assets/css/_imports' as *;",
        },
      },
    },
    // todo: try to remove console.log from production deployment
    // esbuild: {
    //   drop: ['console', 'debugger'],
    //   pure: ['console.log', 'console.error', 'console.warn', 'console.debug', 'console.trace'],
    // },
  },
  typescript: {
    strict: true,
    typeCheck: true,
  },
  // todo: try to generate multiple routes with same route but differnt query params
  // generate: {
  //   routes() {
  // return [{ route: '/', payload: { locale: 'pt-BR' } }];
  // return []
  //   },
  // },
  // pre generate other routes as well
  nitro: {
    ...(preset ? { preset } : {}),
    prerender: {
      crawlLinks: true, // use true when you want all routes to be pre-rendered
      // this two options might be still experimental so check the need of
      // enabling <defineNuxtConfig>experimental.payloadExtraction: true
      // routes: ['/', '/music'], // select routes to be pre-rendered
      // ignore: ['/stupid-route'], // ignore routes to be pre-rendered
    },
  },
  // todo:  remove this when netlify fix the out of memory problem during deployment
  // https://answers.netlify.com/t/javascript-heap-out-of-memory-when-trying-to-build-a-nuxt-app/93138/13
  ...(preset === 'netlify'
    ? {
        postcss: {
          plugins: {
            cssnano:
              process.env.NODE_ENV === 'production'
                ? { preset: ['default', { discardComments: { removeAll: true } }] }
                : (false as any), // disable cssnano when not in production
          },
        },
      }
    : {}),
  // todo: remove - https://github.com/nuxt/nuxt/issues/14124
  sourcemap: {
    server: false,
    client: false,
  },
  // https://answers.netlify.com/t/javascript-heap-out-of-memory-when-trying-to-build-a-nuxt-app/93138/14?u=leonardorick

  compatibilityDate: '2024-07-18',
});
