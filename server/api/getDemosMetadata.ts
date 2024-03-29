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

  const { demosReady } = await getSettings();
  const { availableDemos } = await getUser(userId);
  const availableDemosReady = availableDemos.filter((demo) => demosReady.includes(demo));

  try {
    const query = await databases.listDocuments<DemoModel>(databaseId, collections.demos, [
      Query.equal('number', availableDemosReady),
    ]);
    return query.documents.map((demo) => ({
      // todo in the future return the image cover of the demo if it exists
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
