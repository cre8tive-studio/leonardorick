import { IdValueModel } from './id-value';
import { LanguageOptions } from '~/utils/constants/languages';

export interface QuoteModel extends IdValueModel {
  author: string;
  lang: LanguageOptions;
}

export type QuotePerLangModel = Record<LanguageOptions, QuoteModel[]>;
