import { useAppStore } from '~/store';

/**
 *  Hook used to update language in the store and in the URL
 * @param watcher a callback function to run everytime the lang value changes.
 * usually you want to call your content API or some backend to get new language information after that
 * @returns the locale so it can be used in the template to update the html lang attribute of some sort of select tag
 */
const useLang = (watcher?: () => void) => {
  const store = useAppStore();
  const router = useRouter();
  const route = useRoute();
  const { locale } = useI18n();
  const { lang } = toRefs(store);

  const queryLang = route.query.lang as string;
  if (queryLang) {
    locale.value = queryLang;
  }

  watch(lang, () => {
    watcher && watcher();
    router.push({ query: { lang: lang.value } });
  });
  return {
    locale,
  };
};

export default useLang;
