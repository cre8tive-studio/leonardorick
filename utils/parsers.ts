import type { SettingsClientModel, SettingsModel } from '~/types/settings.model';
import type { UpvotesClientModel, UpvotesModel } from '~/types/upvotes.model';

export function parseSettings({
  availableSongsCount,
  songsReady,
  startSongsCount,
  upvotesMultiplier,
}: SettingsModel): SettingsClientModel {
  return {
    availableSongsCount,
    songsReady,
    startSongsCount,
    upvotesMultiplier,
  };
}

export function parseUpvotes(res: { documents: UpvotesModel[] }): UpvotesClientModel {
  return res.documents
    .map((doc) => ({ id: doc.$id, votes: doc.votes }))
    .reduce((acc, curr) => {
      acc[curr.id] = curr.votes;
      return acc;
    }, {} as UpvotesClientModel);
}
