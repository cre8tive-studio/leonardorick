import type { Models } from 'appwrite';
import type { AudioModel } from './audio.model';

export interface DemoModel extends Models.Document, AudioModel {
  votes: number;
}
