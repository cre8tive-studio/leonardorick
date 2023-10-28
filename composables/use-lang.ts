import { useAppStore } from '~/store';
import type { LanguageOptions } from '~/utils/constants/languages';

// setup to control language changes. If outside of a setup function
// (e.g. plugin) you'll need to provide the i18n instance
const useLang = (i18n?: ReturnType<typeof useI18n>) => {
  const store = useAppStore();
  const router = useRouter();
  const route = useRoute();
  const { locale } = i18n || useI18n();
  const { lang } = toRefs(store);
  watch(lang, () => {
    locale.value = lang.value;
    router.push({ query: { locale: lang.value } });
  });

  const queryLang = route.query.locale as LanguageOptions;
  if (queryLang) {
    lang.value = queryLang;
    locale.value = lang.value;
  }
};

export default useLang;
