import { Query } from 'node-appwrite';
import { createGenericError } from '../utils/errors';
import useServerAppwrite from '~/composables/use-server-appwrite';
import type { DemoModel } from '~/types/demo.model';

const { databases, databaseId, collections, storage, bucketId, getUser, getSettings } =
  useServerAppwrite();

export default defineEventHandler(async (event) => {
  const { userId } = event.context.auth;
  const { number } = await readBody(event);
  if (!userId) {
    throw createGenericError('User not allowed');
  }

  const { songsReady } = await getSettings();

  if (!songsReady.includes(number)) {
    return null;
  }

  if (!number) {
    throw createGenericError('Missing number of song on request', 422);
  }

  const { availableSongs } = await getUser(userId);
  if (!availableSongs || availableSongs.length === 0 || !songsReady.includes(number)) {
    throw createGenericError(`User not allowed to listen to requested song ${number}`);
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
