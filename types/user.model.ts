import type { Models } from 'appwrite';

export interface UserModel extends Models.Document {
  email: string;
  stripeId: string;
  name: string;
  uid: string;
  verified: boolean;
  availableDemos: number[];
}
