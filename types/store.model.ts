import type { QuotePerLangModel } from './quote.model';
import type { RecommendationModel } from './recommendation-model';
import type { LanguageOptions } from '~/utils/constants/languages';

export interface StoreModel {
  recommendations: RecommendationModel[];
  quotes: QuotePerLangModel;
  lang: LanguageOptions;
  loaded: boolean;
}
