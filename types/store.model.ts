import { RecommendationPerLangModel } from './recommendation.model';
import { LanguageOptions } from '~/utils/constants/languages';

export interface StoreModel {
  recommendations: RecommendationPerLangModel;
  lang: LanguageOptions;
  loaded: boolean;
}
