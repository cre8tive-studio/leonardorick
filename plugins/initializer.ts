import { defineNuxtPlugin } from 'nuxt/app';
import { useAppStore } from '~/store';
import { LanguageOptions } from '~/utils/constants/languages';
export default defineNuxtPlugin(async (_nuxtApp) => {
  const fetchInitialData = async () => {
    // we can't call this function at the first initialization
    // because there the store is not yet initialized;
    const store = useAppStore();
    const { lang } = toRefs(store);
    return await _fetchInitialData(lang.value);
  };

  const { query } = useRoute();
  const { $recommendations: recommendations, $quotes: quotes } = await _fetchInitialData(
    query?.locale as LanguageOptions
  );

  return {
    provide: {
      recommendations,
      quotes,
      fetchInitialData,
    },
  };
});

const _fetchInitialData = async (locale: LanguageOptions) => {
  const [{ data: $recommendations }, { data: $quotes }] = await Promise.all([
    useFetch(localeRoute('/api/recommendations', locale)),
    useFetch(localeRoute('/api/quotes', locale)),
  ]);
  return { $recommendations, $quotes };
};
