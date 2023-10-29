import type { StoreModel } from '~/types/store.model';

export const useAppStore = defineStore('store', () => {
  const state = reactive<StoreModel>({
    lang: 'en',
    session: null,
    loaded: false,
    settings: null,
    recommendations: [],
    quotes: [],
    lastJWT: {
      jwt: '',
      expire: 0,
    },
  });

  return {
    ...toRefs(state),
    // add needed functions here
  };
});

export type StoreType = ReturnType<typeof useAppStore>;
