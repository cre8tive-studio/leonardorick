import type { Models } from 'appwrite';

export interface SettingsClientModel {
  // the real number of demos that are available to the user that
  // is incremented on each payment considering the startDemosCount
  // and the amount of payments already made
  availableDemosCount: number;
  // what are the demos that are ready to be shown to the user.
  demosReady: number[];
  // how many demos should be available to the user when he starts his account
  startDemosCount: number;
  // how many upvotes should be available to the user based on the number of
  // available demos. If its 2 and there are 10 demos, the user will have 20 votes
  upvotesMultiplier: number;
}

export interface SettingsModel extends Models.Document, SettingsClientModel {}
