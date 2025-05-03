import { Query } from 'node-appwrite';
import { createGenericError } from '../utils/errors';
import useServerAppwrite from '~/composables/use-server-appwrite';
import type { DemoModel } from '~/types/demo.model';

const { databases, databaseId, collections, storage, bucketId, getUser, getSettings } = useServerAppwrite();

// we use a dynamic url just for the purpose of separating the calls. If we keep the same path
// for all songs, when we try to cache this call, all requests will be cahed as the same and it will
// return the same song file for all of them. Once we call getDemoFile/1 and getDemoFile/2, the cache
// will be stored separatedly by nuxt
export default defineEventHandler(async (event) => {
  if (!event.context.auth?.userId) {
    throw createGenericError('User not allowed');
  }

  const { userId } = event.context.auth;
  const { fileId } = await readBody(event);

  if (!fileId) {
    throw createGenericError('Missing fileId of demo on request', 422);
  }

  const query = await databases.listDocuments<DemoModel>(databaseId, collections.demos, [
    Query.equal('fileId', [fileId]),
  ]);

  if (!query || !query.documents || query.documents.length === 0) {
    throw createGenericError(`Unable to find document related with fileId: ${fileId}`, 422);
  }

  const number = query.documents[0].number;

  if (!query.documents.length) {
    throw createGenericError(`Unable to find number or demo related with fileId: ${fileId}`, 422);
  }

  const { demosReady } = await getSettings();

  if (!demosReady.includes(number)) {
    throw createGenericError(`Demo requested is not ready: ${number}`, 422);
  }

  const { availableDemos } = await getUser(userId);

  if (
    !availableDemos ||
    availableDemos.length === 0 ||
    !demosReady.includes(number) ||
    !availableDemos.includes(number)
  ) {
    throw createGenericError(`User not allowed to listen to requested demo ${number}`);
  }

  try {
    return storage.getFileDownload(bucketId, fileId).then(Buffer.from);
  } catch (err: any) {
    throw createGenericError(err.message);
  }
});
