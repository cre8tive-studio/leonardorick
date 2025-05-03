import type { AudioModel } from './audio.model';

export interface DemoClientModel extends AudioModel {
  votes: number;
}
