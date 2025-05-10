import type { Models } from 'appwrite';

export interface UserModel {
  email: string;
  stripeId: string;
  subscriptionId: string;
  name: string;
  uid: string;
  verified: boolean;
  availablePreviews: number[];
  featuredPreviews?: number[]; // list of previews in availablePreviews to show the ribbon at the top
}

export const UPDATABLE_USER_KEYS: Partial<UserModel> = {
  email: '',
  name: '',
  availablePreviews: [],
  subscriptionId: '',
  verified: true,
  featuredPreviews: [],
} as const;
export type UpdatableUserKey = keyof typeof UPDATABLE_USER_KEYS;
export type UpdatableUserModel = Pick<UserModel, UpdatableUserKey>;

export interface AppwriteUserModel extends Models.Document, UserModel {}
