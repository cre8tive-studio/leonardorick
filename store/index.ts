import { DEFAULTS } from '~/utils/constants/defaults';
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
    isContentLoaded: false,
    isContentErrored: false,
  });

  const loaded = computed(() => state.isContentLoaded && animationsStore.isLRModelLoaded);

  const experienceYears = computed(
    () =>
      new Date().getFullYear() -
      new Date(state.personalInfo?.startWorkingDate || DEFAULTS.startWorkingDate).getFullYear()
  );

  const route = useRoute();
  const localeRoute = computed(() => (r: string) => ({
    name: r,
    query: { ...route.query, locale: state.lang === 'en' ? undefined : state.lang },
  }));

  return {
    ...toRefs(state),
    experienceYears,
    loaded,
    localeRoute,
    // add needed functions here
  };
});

export type StoreType = ReturnType<typeof useAppStore>;
