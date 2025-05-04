import { useAppStore } from '~/store';

const cache = new Map<string, { expire: number; data: any }>();

type Options = Parameters<typeof $fetch>[1] & {
  cacheKey?: string;
  authenticated?: boolean;
  expireInMinutes?: number;
  getJWT?: () => Promise<string>;
};

const useRequest = () => {
  const { subscription } = toRefs(useAppStore());

  const request = async <T>(
    url: string,
    { cacheKey, authenticated = false, expireInMinutes = 15, getJWT, ...options }: Options = {}
  ) => {
    if (cacheKey) {
      const cached = cache.get(cacheKey);
      if (cached) {
        const { expire, data } = cached;
        if (isNotExpired(expire)) {
          return data as T;
        }
        // We don't need to clean up because if we reach the below condition, the key is going to be updated anyway
      }
    }

    const data = $fetch<T>(url, {
      ...options,
      ...(authenticated
        ? {
            headers: {
              // keep the hook here as if we use useAppwrite in the composable initialization we create a circular dependency
              // because we are using this hook inside hooks that depends on appwrite. For every place that you create this
              // circular dependency send the getJWT function separately so it doesn't reach this part.
              Authorization: getJWT ? await getJWT() : await useAppwrite().getJWT(),
              ...(subscription.value ? { 'X-Subscription-ID': subscription.value.id } : {}),
            },
          }
        : {}),
    });

    if (cacheKey) {
      cache.set(cacheKey, { expire: getExpireTime(expireInMinutes), data });
    }

    return data;
  };
  return {
    request,
  };
};

export default useRequest;
