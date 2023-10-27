import type { AsyncData } from 'nuxt/dist/app/composables/asyncData';
import { useFetch } from 'nuxt/app';

const useRequest = () => {
  const { getJWT } = useAppwrite();
  const request = async <T, K = unknown>(
    url: Parameters<typeof useFetch>[0],
    body?: Object
  ): Promise<AsyncData<T, K>> => {
    return useFetch(url, {
      method: 'post',
      ...(body ? { body } : {}),
      headers: {
        Authorization: await getJWT(),
      },
    }) as AsyncData<T, K>;
  };
  return {
    request,
  };
};

export default useRequest;
