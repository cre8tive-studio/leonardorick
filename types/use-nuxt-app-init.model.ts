import type { QuoteModel } from './quote.model';
import type { RecommendationModel } from './recommendation-model';

interface DtoModel {
  $recommendations: Ref<RecommendationModel[]>;
  $quotes: Ref<QuoteModel[]>;
}

export interface UseNuxtAppInitModel extends DtoModel {
  $fetchInitialData: () => Promise<DtoModel>;
  $initializerClientError: (error: Error) => void;
  // used to control cache on useFetch
  payload: any;
  static: any;
}
