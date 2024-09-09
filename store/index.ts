import { useAnimationStore } from './animation';
import type { StoreModel } from '~/types/store.model';

export const useAppStore = defineStore('store', () => {
  const animationsStore = toRefs(useAnimationStore());
  const state = reactive<StoreModel>({
    lang: 'en',
    session: null,
    settings: null,
    recommendations: [],
    quotes: [],
    generals: [],
    experiences: [],
    personalInfo: null,
    lastJWT: {
      jwt: '',
      expire: 0,
    },
    contentLoaded: false,
  });

  const loaded = computed(() => state.contentLoaded && animationsStore.isLRModelLoaded);

  return {
    ...toRefs(state),
    loaded,
    // add needed functions here
  };
});

export type StoreType = ReturnType<typeof useAppStore>;
