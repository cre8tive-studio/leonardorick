import type { UpvotesClientModel, UpvotesModel } from '~/types/upvotes.model';

export function parseUpvotes(res: { documents: UpvotesModel[] }): UpvotesClientModel {
  return res.documents
    .map((doc) => ({ id: doc.$id, votes: doc.votes }))
    .reduce((acc, curr) => {
      acc[curr.id] = curr.votes;
      return acc;
    }, {} as UpvotesClientModel);
}
