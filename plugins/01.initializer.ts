import { defineNuxtPlugin } from 'nuxt/app';
import { useAppStore } from '~/store';
import type { i18nModel } from '~/types/i18n.model';
import type { LanguageOptions } from '~/utils/constants/languages';

export default defineNuxtPlugin(async (_nuxtApp) => {
  const fetchInitialData = async () => {
    // we can't use lang from store the first time this function is called
    // because there the client plugin hasn't run yet on server. Which means
    // that the lang will always be 'en'. So the first time we check the route
    // lang, and the next times we use the store lang.
    const store = useAppStore();
    const { lang } = toRefs(store);
    return await _fetchInitialData(lang.value);
  };

  const { query } = useRoute();
  const locale = (query?.locale as LanguageOptions) || 'en';

  const { $recommendations: recommendations, $quotes: quotes } = await _fetchInitialData(locale);

  (_nuxtApp.$i18n as i18nModel).locale.value = locale;

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
