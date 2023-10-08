import { useAppStore } from '~/store';
import { LanguageOptions } from '~/utils/constants/languages';

// setup to control language chaneges
const useLang = () => {
  const store = useAppStore();
  const router = useRouter();
  const route = useRoute();
  const { locale } = useI18n();
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
