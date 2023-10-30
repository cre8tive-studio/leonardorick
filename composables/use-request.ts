import type { AsyncData } from 'nuxt/dist/app/composables/asyncData';
import { useFetch } from 'nuxt/app';

const useRequest = () => {
  const nuxtApp = useNuxtApp();
  const expire = ref(getExpireTime());
  const { getJWT } = useAppwrite();
  const request = async <T, K = unknown>(
    url: Parameters<typeof useFetch>[0],
    body?: Object,
    cache: boolean = false
  ): Promise<AsyncData<T, K>> => {
    return useFetch(url, {
      method: 'post',
      ...(body ? { body } : {}),
      headers: {
        Authorization: await getJWT(),
      },
      transform(input: AsyncData<T, K>) {
        // transform don't run on cached data so we can be sure that
        // this expire date iw always the last date that really
        // called the API, and can use this value inside getChachedData
        // to refresh the cahed demo file
        expire.value = getExpireTime();
        return input;
      },
      getCachedData(key) {
        if (!cache) {
          return null;
        }

        // documented way to access cached data:
        // https://github.com/nuxt/nuxt/issues/15445#issuecomment-1779361265
        const cached = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
        if (!cached) {
          return null;
        }

        if (isNotExpired(expire.value)) {
          return cached;
        }
        // if you return nullish here --> refetch data
        // if you return anything here, this will be used as the value
        // reaching here is like returning undefined
      },
    }) as AsyncData<T, K>;
  };
  return {
    request,
  };
};

export default useRequest;
