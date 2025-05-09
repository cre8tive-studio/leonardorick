import type { Models } from 'appwrite';

export interface AllowedEmailModel extends Models.Document {
  email: string;
  name: string;
  stripeId: string;
  availablePreviews: number[];
  subscriptionId: string;
}
