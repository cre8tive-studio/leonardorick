const cache = new Map<string, { expire: number; data: any }>();

interface Options {
  body?: Object;
  cached?: boolean | string;
  authenticated?: boolean;
}

function getCacheKey(cached: Options['cached'], url: string) {
  return typeof cached === 'string' ? cached : url;
}
const useRequest = () => {
  const { getJWT } = useAppwrite();
  const request = async <T>(url: string, { body = {}, cached = false, authenticated = false }: Options = {}) => {
    if (cached) {
      const cachedData = cache.get(getCacheKey(cached, url));
      if (cachedData) {
        const { expire, data } = cachedData;
        if (isNotExpired(expire)) {
          return data;
        }
        // We don't need to clean up because if we reach the below condition, the key is going to be updated anyway
      }
    }
    const data = $fetch<T>(url, {
      method: 'post',
      body,
      ...(authenticated
        ? {
            headers: {
              Authorization: await getJWT(),
            },
          }
        : {}),
    });

    if (cached) {
      cache.set(getCacheKey(cached, url), { expire: getExpireTime(), data });
    }

    return data;
  };
  return {
    request,
  };
};

export default useRequest;
