import { QuotePerLangModel } from '~/types/recommendation.model';
import { StoreModel } from '~/types/store.model';
import { LanguageOptions } from '~/utils/constants/languages';

export const useAppStore = defineStore('store', () => {
  const state = reactive<StoreModel>({
    lang: useI18n().locale.value as LanguageOptions,
    loaded: false,
    recommendations: {} as QuotePerLangModel,
    quotes: {} as QuotePerLangModel,
  });

  // actions
  async function initRecommendations() {
    return useFetch<QuotePerLangModel>(`/api/recommendations?lang=${state.lang}`).then(
      ({ data }) => {
        if (data.value) {
          state.recommendations = data.value;
        }
        return data;
      }
    );
  }

  async function initQuotes() {
    return useFetch<QuotePerLangModel>('/api/quotes').then(({ data }) => {
      if (data.value) {
        state.quotes = data.value;
      }
      return data;
    });
  }

  return {
    ...toRefs(state),
    initRecommendations,
    initQuotes,
  };
});

export type StoreType = ReturnType<typeof useAppStore>;
