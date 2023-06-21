import type { ExperienceModel } from './experience.model';
import { FloorModel } from './floor.model';
import { FoxModel } from './fox.model';

export interface WorldModel {
  experience: ExperienceModel;
  floor: FloorModel;
  environment: {
    setDebug: () => void;
  };
  fox: FoxModel;
  update: () => void;
}
