import { Query } from 'node-appwrite';
import { createGenericError } from '../utils/errors';
import useServerAppwrite from '~/composables/use-server-appwrite';
import type { PreviewModel } from '~/types/preview.model';
import type { PremiumAudioModel } from '~/types/premium-audio.model';

const { databases, databaseId, collections, getUser, getSettings } = useServerAppwrite();

export default defineEventHandler(async (event) => {
  if (!event.context.auth) {
    throw createGenericError('Request require authentication');
  }

  const { userId } = event.context.auth;

  if (!userId) {
    throw createGenericError('User not allowed');
  }

  const { previewsReady } = await getSettings();
  const { availablePreviews } = await getUser(userId);
  const availablePreviewsReady = availablePreviews.filter((preview) => previewsReady.includes(preview));

  if (!availablePreviewsReady.length) {
    // this condition should never happen, that's why we will throw an error here
    throw createGenericError('User has no available preview or available user available previews are not ready');
  }

  try {
    const query = await databases.listDocuments<PreviewModel>(databaseId, collections.previews, [
      Query.equal('number', availablePreviewsReady),
    ]);
    return query.documents.map(
      (preview) =>
        ({
          type: 'preview',
          id: preview.$id,
          imageUrl: preview.imageUrl,
          title: preview.title,
          description: preview.description,
          number: preview.number,
          enabled: preview.enabled,
        } satisfies PremiumAudioModel)
    );
  } catch (err: any) {
    throw createGenericError(err.message);
  }
});
