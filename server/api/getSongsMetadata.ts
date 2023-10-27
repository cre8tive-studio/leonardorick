import { Query } from 'node-appwrite';
import { createGenericError } from '../utils/errors';
import useServerAppwrite from '~/composables/use-server-appwrite';
import type { DemoModel } from '~/types/demo.model';

const { databases, databaseId, collections, getUser, getSettings } = useServerAppwrite();

export default defineEventHandler(async (event) => {
  const { userId } = event.context.auth;

  if (!userId) {
    throw createGenericError('User not allowed');
  }

  const { songsReady } = await getSettings();
  const { availableSongs } = await getUser(userId);
  const availableSongsReady = availableSongs.filter((song) => songsReady.includes(song));

  try {
    const query = await databases.listDocuments<DemoModel>(databaseId, collections.demos, [
      Query.equal('number', availableSongsReady),
    ]);
    return query.documents.map((demo) => ({
      // todo in the future return the image cover of the song if it exists
      coverImg: null,
      title: demo.title,
      description: demo.description,
      number: demo.number,
      file: null,
    }));
  } catch (err: any) {
    throw createGenericError(err.message);
  }
});
