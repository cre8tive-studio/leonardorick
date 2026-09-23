import { defineNuxtPlugin, useFetch } from 'nuxt/app';
import { useAppStore } from '~/store';
import type { ExperienceModel } from '~/types/experience.model';
import type { GeneralsModel } from '~/types/generals.model';
import type { i18nModel } from '~/types/i18n.model';
import type { PersonalInfoModel } from '~/types/personal-info.model';
import type { QuoteModel } from '~/types/quote.model';
import type { RecommendationModel } from '~/types/recommendation-model';
import { type LanguageOptions } from '~/utils/constants/languages';

export default defineNuxtPlugin(async (nuxtApp) => {
  // Error pages and unmatched URLs do not need the portfolio's CMS queries.
  if (useError().value || !useRoute().matched.length) return {};

  const fetchInitialData = async () => {
    const store = useAppStore();
    const { lang } = toRefs(store);
    return await _fetchInitialData(lang.value, $fetch);
  };

  useLang(nuxtApp.$i18n as i18nModel);
  const locale = useAppStore().lang;

  const {
    $recommendations: recommendations,
    $quotes: quotes,
    $experiences: experiences,
    $generals: generals,
  } = await _fetchInitialData(locale, useFetch);

  const personalInfo = await fetchPersonalInfo();

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
    f<RecommendationModel[]>(apiLocalized('/api/recommendations', locale)),
    f<QuoteModel[]>(apiLocalized('/api/quotes', locale)),
    f<GeneralsModel[]>(apiLocalized('/api/generals', locale)),
    f<ExperienceModel[]>(apiLocalized('/api/experiences', locale)),
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

export function apiLocalized(route: string, locale?: string) {
  return `${route}${locale ? `?locale=${locale}` : ''}`;
}
