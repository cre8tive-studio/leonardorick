import { IdValueModel } from '~/types/id-value';
import { StoreModel } from '~/types/store-model';

export const useAppStore = defineStore('store', () => {
  const state = reactive<StoreModel>({
    lang: computed(() => useI18n().locale),
    loading: false,
    quotes: [],
  });

  // actions
  async function initQuotes() {
    state.loading = true;
    return useFetch<{ data: IdValueModel[] }>(`/api/quotes?lang=${state.lang.value}`)
      .then(({ data }) => {
        if (data.value) {
          state.quotes = data.value.data;
        }
      })
      .finally(() => (state.loading = false));
  }

  return {
    ...toRefs(state),
    initQuotes,
  };
});

export type StoreType = ReturnType<typeof useAppStore>;
