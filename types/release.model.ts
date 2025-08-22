import type { Models } from 'appwrite';

export interface ReleaseModel extends Models.Document {
  title: string;
  spotify: string;
  fileId: string;
  imageUrl: string;
  appleMusic: string;
  featured?: boolean;
  number: number;
  releaseDate?: string;
}
