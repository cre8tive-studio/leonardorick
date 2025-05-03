import { localforageGetItem } from '../utils/js-utilities';
interface Props {
  fileId: string;
  authenticated?: boolean;
  url?: string;
}
// This composable has two levels of composables:
// 1. IndexedDB with localForage that caches data on users browswer
// 2. Local cache inside use-request Map

// if props contains a url we download the url.
// otherwise we call our endpoint /api/getFile that goes to appwrite download the file
const useCachedFile = () => {
  const { request } = useRequest();

  async function getCachedFile({ fileId, authenticated = false, url }: Props) {
    const file = await localforageGetItem<Blob>(fileId);
    if (file) {
      return new Promise<Blob>((resolve) => resolve(file));
    }

    if (url) {
      return request<Blob>(url, { cacheKey: fileId, method: 'get' }).then((blob) => localforageSetItem(fileId, blob));
    }

    return request<Blob>('/api/getFile', {
      method: 'post',
      body: {
        fileId,
      },
      responseType: 'blob',
      authenticated,
      cacheKey: fileId,
      expireInMinutes: 60,
    }).then((blob) => localforageSetItem(fileId, blob));
  }

  return { getCachedFile };
};

export default useCachedFile;
