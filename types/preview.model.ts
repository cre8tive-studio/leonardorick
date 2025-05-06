import type { Models } from 'appwrite';
import type { AudioModel } from './audio.model';

export interface PreviewModel extends Models.Document, AudioModel {
  votes: number;
  enabled: boolean;
  featured?: boolean;
}
