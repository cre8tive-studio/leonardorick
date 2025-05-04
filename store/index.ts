import type { LocationQuery } from 'vue-router';
import { useAnimationStore } from './animation';
import { DEFAULTS } from '~/utils/constants/defaults';
import type { StoreModel } from '~/types/store.model';

export const useAppStore = defineStore('store', () => {
  const animationsStore = toRefs(useAnimationStore());
  const state = reactive<StoreModel>({
    lang: 'en',
    session: null,
    subscription: null,
    user: null,
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
    cache: {
      en: {
        recommendations: [],
        quotes: [],
        generals: [],
        experiences: [],
      },
      'pt-BR': {
        recommendations: [],
        quotes: [],
        generals: [],
        experiences: [],
      },
    },
  });

  const loaded = computed(() => state.isContentLoaded && animationsStore.isLRModelLoaded);
  const userId = computed(() => state.session?.userId || '');
  const experienceYears = computed(
    () =>
      new Date().getFullYear() -
      new Date(state.personalInfo?.startWorkingDate || DEFAULTS.startWorkingDate).getFullYear()
  );

  const route = useRoute();

  /**
   * Generates a localized route object.
   * @param r - The route name.
   * @param options - An object containing options.
   * @param options.clean - If true, removes other query parameters besides the locale.
   * @param options.includeBase - Only works for the resolve() method and includes or not the origin url in the result
   * @param options.query - Other query items that we want to add to the localized route.
   * @returns A route object with the localized query parameters and a function to resolve the object to a string.
   */
  function localeRoute(
    r: string,
    {
      clean = false,
      includeBase = true,
      query = {},
    }: { clean?: boolean; includeBase?: boolean; query?: LocationQuery } = {}
  ) {
    const locale = state.lang === 'en' ? undefined : state.lang;
    const q = clean ? { ...query, locale } : { ...route.query, ...query, locale };

    return {
      name: r,
      query: q,
      resolve: () => {
        const params = new URLSearchParams(
          Object.entries(q).reduce((acc, [key, value]) => {
            if (value !== undefined) acc[key] = value as string;
            return acc;
          }, {} as Record<string, string>)
        ).toString();

        return `${includeBase ? location.origin : ''}/${r}${params ? '?' + params : ''}`;
      },
    };
  }

  return {
    ...toRefs(state),
    loaded,
    userId,
    experienceYears,
    localeRoute,
  };
});

export type StoreType = ReturnType<typeof useAppStore>;
