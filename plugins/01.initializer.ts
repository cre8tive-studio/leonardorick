import { defineNuxtPlugin, useFetch } from 'nuxt/app';
import { useAppStore } from '~/store';
import type { ExperienceModel } from '~/types/experience.model';
import type { GeneralsModel } from '~/types/generals.model';
import type { i18nModel } from '~/types/i18n.model';
import type { PersonalInfoModel } from '~/types/personal-info.model';
import type { QuoteModel } from '~/types/quote.model';
import type { RecommendationModel } from '~/types/recommendation-model';
import type { LanguageOptions } from '~/utils/constants/languages';

export default defineNuxtPlugin(async (_nuxtApp) => {
  const fetchInitialData = async () => {
    // we can't use lang from store the first time this function is called
    // because there the client plugin hasn't run yet on server. Which means
    // that the lang will always be 'en'. So the first time we check the route
    // lang, and the next times we use the store lang.
    const store = useAppStore();
    const { lang } = toRefs(store);
    return await _fetchInitialData(lang.value, $fetch);
  };

  const { query } = useRoute();
  const locale = (query?.locale as LanguageOptions) || 'en';

  const {
    $recommendations: recommendations,
    $quotes: quotes,
    $experiences: experiences,
    $generals: generals,
  } = await _fetchInitialData(locale, useFetch);

  const personalInfo = await fetchPersonalInfo();

  (_nuxtApp.$i18n as i18nModel).locale.value = locale;

  return {
    provide: {
      recommendations,
      quotes,
      experiences,
      generals,
      personalInfo,
      fetchInitialData,
    },
  };
});

type FetchFunction =
  | (<T>(url: string) => Promise<{ data: T }>) // Type for useFetch
  | (<T>(url: string) => Promise<T>); // Type for $fetch

const _fetchInitialData = async (locale: LanguageOptions, f: FetchFunction) => {
  const res = await Promise.all([
    f<RecommendationModel[]>(localeRoute('/api/recommendations', locale)),
    f<QuoteModel[]>(localeRoute('/api/quotes', locale)),
    f<GeneralsModel[]>(localeRoute('/api/generals', locale)),
    f<ExperienceModel[]>(localeRoute('/api/experiences', locale)),
  ]);

  const [$recommendations, $quotes, $generals, $experiences] = res.map((item) =>
    isDataWrapper(item) && item.data ? item.data : item
  );

  return { $recommendations, $quotes, $experiences, $generals };
};

function fetchPersonalInfo() {
  return useFetch<PersonalInfoModel>('/api/personal-info').then((res) => res.data);
}

// Type guard to check if the fetch function returns a data object or not
function isDataWrapper<T>(result: any): result is { data: T } {
  return result && Object.prototype.hasOwnProperty.call(result, 'data');
}
