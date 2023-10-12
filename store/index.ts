import { StoreModel } from '~/types/store.model';

import type { LanguageOptions } from '~/utils/constants/languages';

export const useAppStore = defineStore('store', () => {
  const state = reactive<StoreModel>({
    lang: useI18n().locale.value as LanguageOptions,
    sessionId: '',
    loaded: false,
    recommendations: [],
    quotes: [],
  });

  return {
    ...toRefs(state),
  };
});

export type StoreType = ReturnType<typeof useAppStore>;
