import type { ExperienceModel } from '../experience.model';

export interface ExperiencesResponse {
  Experiences: {
    docs: ExperienceModel[];
  };
}
