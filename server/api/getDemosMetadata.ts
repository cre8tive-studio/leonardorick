import { Query } from 'node-appwrite';
import { createGenericError } from '../utils/errors';
import useServerAppwrite from '~/composables/use-server-appwrite';
import type { DemoModel } from '~/types/demo.model';
import { DemoClientModel } from '~/types/demo-client.model';

const { databases, databaseId, collections, getUser, getSettings } = useServerAppwrite();

export default defineEventHandler(async (event) => {
  if (!event.context.auth) {
    throw createGenericError('Request require authentication');
  }

  const { userId } = event.context.auth;

  if (!userId) {
    throw createGenericError('User not allowed');
  }

  const { demosReady } = await getSettings();
  const { availableDemos } = await getUser(userId);
  const availableDemosReady = availableDemos.filter((demo) => demosReady.includes(demo));

  if (!availableDemosReady.length) {
    // this condition should never happen, that's why we will throw an error here
    throw createGenericError('User has no available demo or available user available demos are not ready');
  }

  try {
    const query = await databases.listDocuments<DemoModel>(databaseId, collections.demos, [
      Query.equal('number', availableDemosReady),
    ]);
    return query.documents.map((demo) => ({
      id: demo.$id,
      // todo in the future return the image cover of the demo if it exists
      imageUrl: null,
      title: demo.title,
      description: demo.description,
      number: demo.number,
      votes: demo.votes,
      fileId: demo.fileId,
      audioUrl: null,
    })) as DemoClientModel[];
  } catch (err: any) {
    throw createGenericError(err.message);
  }
});
