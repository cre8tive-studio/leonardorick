import { QuotePerLangModel } from './recommendation.model';
import { LanguageOptions } from '~/utils/constants/languages';

export interface StoreModel {
  recommendations: QuotePerLangModel;
  quotes: QuotePerLangModel;
  lang: LanguageOptions;
  loaded: boolean;
}
