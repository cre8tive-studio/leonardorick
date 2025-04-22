import type { Models } from 'appwrite';

export interface ReleaseModel extends Models.Document {
  name: string;
  spotify: string;
  fileId: string;
  imageUrl: string;
  appleMusic: string;
  featured?: boolean;
}
