import { RecommendationPerLangModel } from '~/types/recommendation.model';
import { StoreModel } from '~/types/store.model';
import { LanguageOptions } from '~/utils/constants/languages';

export const useAppStore = defineStore('store', () => {
  const state = reactive<StoreModel>({
    lang: useI18n().locale.value as LanguageOptions,
    loaded: false,
    recommendations: {} as RecommendationPerLangModel,
  });

  // actions
  async function initRecommendations() {
    return useFetch<RecommendationPerLangModel>(`/api/recommendations?lang=${state.lang}`).then(
      ({ data }) => {
        if (data.value) {
          state.recommendations = data.value;
        }
        return data;
      }
    );
  }

  return {
    ...toRefs(state),
    initRecommendations,
  };
});

export type StoreType = ReturnType<typeof useAppStore>;
