import type { RecommendationModel } from '~/types/recommendation-model';

export interface RecommendationsResponse {
  Recommendations: {
    docs: RecommendationModel[];
  };
}
