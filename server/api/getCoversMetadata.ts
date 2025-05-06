import { createGenericError } from '../utils/errors';
import useServerAppwrite from '~/composables/use-server-appwrite';
import type { PreviewModel } from '~/types/preview.model';
import { PremiumAudioModel } from '~/types/premium-audio.model';

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
    return databases.listDocuments<PreviewModel>(databaseId, collections.covers).then((list) =>
      list.documents.map(
        (cover) =>
          ({
            type: 'cover',
            id: cover.$id,
            imageUrl: cover.imageUrl,
            title: cover.title,
            description: cover.description,
            number: cover.number,
            votes: cover.votes,
            enabled: cover.enabled,
          } satisfies PremiumAudioModel)
      )
    );
  } catch (err: any) {
    throw createGenericError(err.message);
  }
});
