import localforage from 'localforage';
import { getExpireTime } from '../utils/js-utilities';

interface Props {
  fileId: string;
}
// This composable has two levels of composables:
// 1. IndexedDB with localForage that caches data on users browswer
// 2. Nuxt getCachedData that caches HTTP calls
const useCachedFile = async ({ fileId }: Props) => {
  const nuxtApp = useNuxtApp();

  const file = await localforage.getItem<Blob>(fileId);
  if (file) {
    return new Promise<{ data: globalThis.Ref<{ blob: Blob }> }>((resolve) => resolve({ data: ref({ blob: file }) }));
  }

  return useFetch('/api/getFile', {
    method: 'post',
    key: fileId,
    body: {
      fileId,
    },
    responseType: 'blob',
    // transform don't run on cached data
    transform(input: Blob) {
      localforage.setItem(fileId, input);
      return {
        blob: input,
        expire: getExpireTime(60),
      };
    },
    getCachedData(key: string) {
      // documented way to access cached data:
      // https://github.com/nuxt/nuxt/issues/15445#issuecomment-1779361265
      const cached = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      if (!cached) {
        return null;
      }

      if (isNotExpired(cached.expire)) {
        return cached;
      }
      // if you return nullish here --> refetch data
      // if you return anything here, this will be used as the value
      // reaching here is like returning undefined
    },
  });
};

export default useCachedFile;
