import { Query } from 'node-appwrite';
import { createGenericError } from '../utils/errors';
import useServerAppwrite from '~/composables/use-server-appwrite';
import type { PreviewModel } from '~/types/preview.model';

const { databases, databaseId, collections, storage, bucketId } = useServerAppwrite();

// dynamic url are good for the purpose of separating the caches. If we keep the same path
// for all songs, when we try to cache this call with nuxt mechanisms, all requests will be cahed as the same and it will
// return the same song file for all of them. Once we call getPreviewFile/1 and getPreviewFile/2, the cache
// will be stored separatedly by nuxt getCachedData
export default defineEventHandler(async (event) => {
  if (!event.context.auth?.userId) {
    throw createGenericError('User not allowed');
  }

  const { number } = await readBody(event);

  try {
    const query = await databases.listDocuments<PreviewModel>(databaseId, collections.covers, [
      Query.equal('number', [number]),
    ]);

    if (!query || !query.documents || query.documents.length === 0) {
      throw createGenericError(`Cover ${number} not found`);
    }

    return storage.getFileDownload(bucketId, query.documents[0].fileId).then(Buffer.from);
  } catch (err: any) {
    throw createGenericError(err.message);
  }
});
