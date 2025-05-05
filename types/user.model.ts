import type { Models } from 'appwrite';

export interface UserModel {
  email: string;
  stripeId: string;
  subscriptionId: string;
  name: string;
  uid: string;
  verified: boolean;
  availablePreviews: number[];
  featuredPreviews?: number[];
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
