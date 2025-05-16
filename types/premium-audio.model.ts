import type { AudioModel } from './audio.model';
import type { OmitStrict } from './dts/helpers';

export interface PremiumAudioModel extends OmitStrict<AudioModel, 'fileId'> {
  type: 'cover' | 'preview';
  enabled: boolean;
  featured?: boolean;
  // since getFile is public we never return the premium file id to the client
  fileId?: never;
}
