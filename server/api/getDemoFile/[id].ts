import { Query } from 'node-appwrite';
import { createGenericError } from '../../utils/errors';
import useServerAppwrite from '~/composables/use-server-appwrite';
import type { DemoModel } from '~/types/demo.model';

const { databases, databaseId, collections, storage, bucketId, getUser, getSettings } =
  useServerAppwrite();

// we use a dynamic url just for the purpose of separating the calls. If we keep the same path
// for all songs, when we try to cache this call, all requests will be cahed as the same and it will
// return the same song file for all of them. Once we call getDemoFile/1 and getDemoFile/2, the cache
// will be stored separatedly by nuxt
export default defineEventHandler(async (event) => {
  const { userId } = event.context.auth;
  const { number } = await readBody(event);
  if (!userId) {
    throw createGenericError('User not allowed');
  }

  const { demosReady } = await getSettings();

  if (!demosReady.includes(number)) {
    return null;
  }

  if (!number) {
    throw createGenericError('Missing number of demo on request', 422);
  }

  const { availableDemos } = await getUser(userId);
  if (!availableDemos || availableDemos.length === 0 || !demosReady.includes(number)) {
    throw createGenericError(`User not allowed to listen to requested demo ${number}`);
  }

  try {
    const query = await databases.listDocuments<DemoModel>(databaseId, collections.demos, [
      Query.equal('number', [number]),
    ]);

    if (!query || !query.documents || query.documents.length === 0) {
      throw createGenericError(`Demo ${number} not found`);
    }

    return storage.getFileDownload(bucketId, query.documents[0].fileId);
  } catch (err: any) {
    throw createGenericError(err.message);
  }
});
