// https://nuxt.com/docs/api/configuration/nuxt-config
import { DEFAULT_HEAD } from './utils/analytics/head';
const { VUE_APP_NITRO_PRESET: preset, baseUrl } = process.env;

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
  // https://github.com/nuxt/nuxt/issues/14011
  runtimeConfig: {
    // Private env variables that is only available on the server

    // public env virables that are also available to client
    public: {
      environment: process.env.VUE_APP_ENVIRONMENT,
      appwrite: {
        endpoint: process.env.VUE_APP_APPWRITE_ENDPOINT,
        project: process.env.VUE_APP_APPWRITE_PROJECT,
      },
      baseUrl,
    },
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@vue-macros/nuxt',
    '@nuxtjs/fontaine',
    '@nuxtjs/tailwindcss',
  ],
  pinia: {
    // some imports that are commonly used to be included automatically as nuxt do with much others
    autoImports: ['defineStore', ['defineStore', 'definePiniaStore']],
  },
  // todo: uncommend when i18n starts working again
  // i18n: {
  //   vueI18n: './i18n.config.ts',
  //   baseUrl,
  // },
  app: {
    head: DEFAULT_HEAD,
  },
  vite: {
    assetsInclude: [
      '**/*.svg',
      '**/*.png',
      '**/*.jpg',
      '**/*.gif',
      '**/*.ico',
      '**/*.bin',
      '**/*.gltf',
    ],
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
