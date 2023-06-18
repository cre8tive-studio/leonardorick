import { QuotePerLangModel } from './quote-per-lang.model';
import type { LanguageOptions } from '~/utils/constants/languages';

export interface StoreModel {
  recommendations: QuotePerLangModel;
  quotes: QuotePerLangModel;
  lang: LanguageOptions;
  loaded: boolean;
}
