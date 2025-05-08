import { localforageGetItem } from '../utils/js-utilities';
type Options = Parameters<typeof $fetch>[1] & {
  fileId: string;
  authenticated?: boolean;
  url?: string;
};
// This composable has two levels of composables:
// 1. IndexedDB with localForage that caches data on users browswer
// 2. Local cache inside use-request Map

// if props contains a url we download the url.
// otherwise we call our endpoint /api/getFile that goes to appwrite download the file
export const LOCALFORAGE_AUTH_PREFIX = 'auth-';

const useCachedFile = () => {
  const { request } = useRequest();

  async function getCachedFile({ fileId, authenticated = false, url = '/api/getFile', ...options }: Options) {
    const key = getKey(fileId, authenticated);
    const file = await getCachedFileFromCache(fileId, authenticated);
    if (file) {
      return file;
    }

    return request<Blob>(url, {
      ...(options.method === 'post'
        ? {
            body: {
              fileId,
            },
          }
        : {}),
      responseType: 'blob',
      authenticated,
      cacheKey: fileId,
      expireInMinutes: 60,
      ...options,
    }).then((blob) => localforageSetItem(key, blob));
  }

  async function getCachedFileFromCache(fileId: string, isAuthenticatedContent: boolean = false) {
    const key = getKey(fileId, isAuthenticatedContent);
    const file = (await localforageGetItem<Blob>(key)) || null;
    return new Promise<Blob | null>((resolve) => resolve(file));
  }

  function getKey(key: string, isAuthenticatedContent: boolean) {
    return isAuthenticatedContent ? `${LOCALFORAGE_AUTH_PREFIX}${key}` : key;
  }

  return { getCachedFile, getCachedFileFromCache };
};

export default useCachedFile;
