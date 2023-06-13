// https://nuxt.com/docs/api/configuration/nuxt-config
import { DEFAULT_HEAD } from './utils/analytics/head';
const { NITROPACK_PRESET: preset } = process.env;
console.log('preset', preset);
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
  // runtimeConfig: {
  //   // Private config that is only available on the server
  //   VUE_APP_SANITY_PROJECT_ID: process.env.VUE_APP_SANITY_PROJECT_ID,
  //   VUE_APP_SANITY_CLIENT_TOKEN: process.env.VUE_APP_SANITY_CLIENT_TOKEN,
  //   VUE_APP_SANITY_GRAPHQL_URL: process.env.VUE_APP_SANITY_GRAPHQL_URL,
  //   // Config within public will be also exposed to the client
  //   public: {
  //     VUE_APP_ENVIRONMENT: process.env.VUE_APP_ENVIRONMENT,
  //     VUE_APP_BASE_URL: process.env.VUE_APP_BASE_URL,
  //     environment,
  //   },
  // },
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
  i18n: { vueI18n: './i18n.config.ts' },
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
