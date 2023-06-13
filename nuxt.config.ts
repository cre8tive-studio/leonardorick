// https://nuxt.com/docs/api/configuration/nuxt-config
import { DEFAULT_HEAD } from './utils/analytics/head';
const { VUE_APP_NITRO_PRESET: preset, VUE_APP_BASE_URL: baseUrl } = process.env;

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.scss'],
  routeRules: {
    // redirects goes here
    // '/': { redirect: '/home'}
  },
  // todo think about a better approach until cloudflare supports runtimeconfig
  // https://github.com/unjs/nitro/issues/272
  // https://nitro.unjs.io/deploy/providers/cloudflare
  runtimeConfig: {
    //   // Private config that is only available on the server
    //   VUE_APP_SANITY_PROJECT_ID: process.env.VUE_APP_SANITY_PROJECT_ID,
    //   VUE_APP_SANITY_CLIENT_TOKEN: process.env.VUE_APP_SANITY_CLIENT_TOKEN,
    //   VUE_APP_SANITY_GRAPHQL_URL: process.env.VUE_APP_SANITY_GRAPHQL_URL,
    //   // Config within public will be also exposed to the client
    //   //todo: this is critical, because the client doesnt' have access to the env variables
    //  //todo:  and it's really important to know the environment on both client and server
    public: {
      VUE_APP_ENVIRONMENT: process.env.VUE_APP_ENVIRONMENT,
      VUE_APP_BASE_URL: process.env.VUE_APP_BASE_URL,
      VUE_APP_GOOGLE_ANALYTICS_ID: process.env.VUE_APP_GOOGLE_ANALYTICS_ID,
    },
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@vue-macros/nuxt',
    '@nuxtjs/fontaine',
  ],
  pinia: {
    // some imports that are commonly used to be included automatically as nuxt do with much others
    autoImports: ['defineStore', ['defineStore', 'definePiniaStore']],
  },
  i18n: {
    vueI18n: './i18n.config.ts',
    baseUrl,
  },
  app: {
    head: DEFAULT_HEAD,
  },
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
});
