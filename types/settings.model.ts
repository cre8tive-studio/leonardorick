import type { Models } from 'appwrite';

export interface SettingsModel {
  // what are the previews that are ready to be shown to the user.
  previewsReady: number[];
  // how many previews should be available to the user when he starts his account
  startPreviewsCount: number;
  // how many upvotes should be available to the user based on the number of
  // available previews. If its 2 and there are 10 previews, the user will have 20 votes
  upvotesMultiplier: number;
  // last date assets were updated. This should be used to refresh and clean cache on users machines
  storageVersion: number;
  // how much I need to release the next song
  moneyTarget: number;
  // how much I have til the money target
  savedAmount: number;
  // currency of moneyTarget current
  currency: 'EUR' | 'BRL';
}

export interface AppwriteSettingsModel extends Models.Document, SettingsModel {}
