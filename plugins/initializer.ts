import { defineNuxtPlugin } from 'nuxt/app';
export default defineNuxtPlugin(async (_nuxtApp) => {
  const [{ data: recommendations }, { data: quotes }] = await Promise.all([
    useFetch('/api/recommendations'),
    useFetch('/api/quotes'),
  ]);
  return {
    provide: {
      recommendations,
      quotes,
    },
  };
});
