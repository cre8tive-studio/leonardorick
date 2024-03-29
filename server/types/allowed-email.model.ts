import type { Models } from 'appwrite';

export interface AllowedEmailModel extends Models.Document {
  email: string;
  name: string;
  stripeId: string;
  availableDemos: number[];
  subscriptionId: string;
}
