import type { Models } from 'appwrite';

export interface DemoModel extends Models.Document {
  fileId: string;
  name: string;
  description?: string;
  number: number;
  votes: number;
}
