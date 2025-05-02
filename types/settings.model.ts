import type { Models } from 'appwrite';

export interface SettingsClientModel {
  // what are the demos that are ready to be shown to the user.
  demosReady: number[];
  // how many demos should be available to the user when he starts his account
  startDemosCount: number;
  // how many upvotes should be available to the user based on the number of
  // available demos. If its 2 and there are 10 demos, the user will have 20 votes
  upvotesMultiplier: number;
  // how much I need to release the next song
  moneyTarget: number;
  // how much I have til the money target
  savedAmount: number;
  // currency of moneyTarget current
  currency: 'EUR' | 'BRL';
}

export interface SettingsModel extends Models.Document, SettingsClientModel {}
