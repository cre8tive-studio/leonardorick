import { RecommendationModel } from '~/types/recommendation-model';

export interface RecommendationsRequest {
  Recommendations: {
    docs: RecommendationModel[];
  };
}
