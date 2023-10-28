import type { Models } from 'appwrite';

export interface SettingsClientModel {
  // the real number of songs that are available to the user that
  // is incremented on each payment considering the startSongsCount
  // and the amount of payments already made
  availableSongsCount: number;
  // what are the songs that are ready to be shown to the user.
  songsReady: number[];
  // how many songs should be available to the user when he starts his account
  startSongsCount: number;
  // how many upvotes should be available to the user based on the number of
  // available demos. If its 2 and there are 10 demos, the user will have 20 votes
  upvotesMultiplier: number;
}

export interface SettingsModel extends Models.Document, SettingsClientModel {}
