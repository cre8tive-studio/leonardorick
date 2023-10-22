import { StoreModel } from '~/types/store.model';

export const useAppStore = defineStore('store', () => {
  const state = reactive<StoreModel>({
    lang: 'en',
    sessionId: '',
    loaded: false,
    recommendations: [],
    quotes: [],
  });

  return {
    ...toRefs(state),
    // add needed functions here
  };
});

export type StoreType = ReturnType<typeof useAppStore>;
