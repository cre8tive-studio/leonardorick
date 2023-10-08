import { QuotePerLangModel } from './quote.model';
import { RecommendationModel } from './recommendation-model';

interface DtoModel {
  $recommendations: Ref<RecommendationModel[]>;
  $quotes: Ref<QuotePerLangModel>;
}

export interface UseNuxtAppInitModel extends DtoModel {
  $fetchInitialData: () => Promise<DtoModel>;
}
