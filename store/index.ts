import { StoreModel } from '~/types/store.model';
import { EMPTY_PER_LANG } from '~/utils/constants/empty-per-lang';

import type { LanguageOptions } from '~/utils/constants/languages';

export const useAppStore = defineStore('store', () => {
  const state = reactive<StoreModel>({
    lang: useI18n().locale.value as LanguageOptions,
    loaded: false,
    recommendations: [],
    quotes: structuredClone(EMPTY_PER_LANG),
  });

  return {
    ...toRefs(state),
  };
});

export type StoreType = ReturnType<typeof useAppStore>;
