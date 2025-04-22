import { getExpireTime } from '../utils/js-utilities';

interface Props {
  fileId: string;
}

const useCachedFile = ({ fileId }: Props) => {
  const nuxtApp = useNuxtApp();

  return useFetch('/api/getFile', {
    method: 'post',
    key: fileId,
    body: {
      fileId,
    },
    responseType: 'blob',
    transform(input: Blob) {
      // transform don't run on cached data
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
