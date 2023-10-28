import type { Models } from 'appwrite';

export interface UpvotesModel extends Models.Document {
  votes: string[];
}

export interface UpvotesClientModel {
  [id: string]: string[];
}
