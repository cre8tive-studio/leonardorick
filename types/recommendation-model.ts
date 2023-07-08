import type { Person } from './payload-types';

export interface RecommendationModel {
  id: string;
  author: Person;
  recommendation: string;
}
