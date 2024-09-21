import { useAppStore } from '~/store';
import type { i18nModel } from '~/types/i18n.model';
import type { LanguageOptions } from '~/utils/constants/languages';

// setup to control language changes. If outside of a setup function
// (e.g. plugin) you'll need to provide the i18n instance
const useLang = (i18n?: i18nModel) => {
  const store = useAppStore();
  const router = useRouter();
  const route = useRoute();
  const { locale } = i18n || useI18n();
  const { lang } = toRefs(store);

  const queryLang = route.query.locale as LanguageOptions;
  if (queryLang) {
    lang.value = queryLang;
    locale.value = lang.value;
  }
  // be careful when calling this composable more than once because usually
  // we just want this watch to be settle one time.
  watch(lang, () => {
    locale.value = lang.value;
    // we explecitly remove #hashes here since it's more intuitive to the user
    // to navigate to the hash only once. If we want to keep the hash on the url
    // just add query: {...}, hash: route.hash
    router.push({ query: { ...route.query, locale: lang.value } });
  });
};

export default useLang;
