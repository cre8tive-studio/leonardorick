const cache = new Map<string, { expire: number; data: any }>();

type Options = Parameters<typeof $fetch>[1] & {
  cacheKey?: string;
  authenticated?: boolean;
  expireInMinutes?: number;
};

const useRequest = () => {
  const { getJWT } = useAppwrite();
  const request = async <T>(
    url: string,
    { cacheKey, authenticated = false, expireInMinutes = 15, ...options }: Options = {}
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
              Authorization: await getJWT(),
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
