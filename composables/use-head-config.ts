import { HEAD, ROUTES_HEAD_OPTIONS } from '../utils/analytics/head';
import type { RoutesHeadOptions } from '../utils/analytics/head';
import { useAppStore } from '~/store';

const useHeadConfig = () => {
  const { lang } = toRefs(useAppStore());
  const route = useRoute();
  const lastKey = ref<RoutesHeadOptions | ''>('');

  useHead(HEAD[lang.value][getKey()]);

  watch(
    () => route.path,
    () => {
      const key = getKey();
      const shouldRestoreDefault = lastKey.value && ROUTES_HEAD_OPTIONS.includes(lastKey.value);
      if (shouldRestoreDefault || ROUTES_HEAD_OPTIONS.includes(key)) {
        useHead(HEAD[lang.value][key]);
        lastKey.value = shouldRestoreDefault ? '' : key;
      }
    }
  );

  watch(lang, () => {
    setHead();
  });

  function getKey() {
    const k = route.path.replace('/', '') as RoutesHeadOptions;
    return ROUTES_HEAD_OPTIONS.includes(k) ? k : 'default';
  }

  function setHead() {
    useHead(HEAD[lang.value][getKey()]);
  }
};
export default useHeadConfig;
