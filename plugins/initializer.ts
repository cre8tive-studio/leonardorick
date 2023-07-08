import { defineNuxtPlugin } from 'nuxt/app';
export default defineNuxtPlugin(async (_nuxtApp) => {
  const { query } = useRoute() as { query: { locale?: string } };

  const [{ data: recommendations }, { data: quotes }] = await Promise.all([
    useFetch(localeRoute('/api/recommendations', query?.locale)),
    useFetch(localeRoute('/api/quotes', query?.locale)),
  ]);
  return {
    provide: {
      recommendations,
      quotes,
    },
  };
});
