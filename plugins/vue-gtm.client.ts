import VueGtag, { trackRouter } from 'vue-gtag-next';
export default defineNuxtPlugin((nuxtApp) => {
  const { VUE_APP_ENVIRONMENT, VUE_APP_GOOGLE_ANALYTICS_ID } = useRuntimeConfig().public;
  if (VUE_APP_ENVIRONMENT === 'production') {
    nuxtApp.vueApp.use(VueGtag, {
      property: {
        id: `G-${VUE_APP_GOOGLE_ANALYTICS_ID}`,
      },
    });
    trackRouter(useRouter());
  }
});
