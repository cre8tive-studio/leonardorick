import type { StoreModel } from '~/types/store.model';

export const useAppStore = defineStore('store', () => {
  const state = reactive<StoreModel>({
    lang: 'en',
    sessionId: '',
    loaded: false,
    settings: null,
    recommendations: [],
    quotes: [],
  });

  return {
    ...toRefs(state),
    // add needed functions here
  };
});

export type StoreType = ReturnType<typeof useAppStore>;
