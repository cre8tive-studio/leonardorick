import { IdValueModel } from './id-value';
import { LanguageOptions } from '~/utils/constants/languages';

export interface RecommendationModel extends IdValueModel {
  author: string;
  lang: LanguageOptions;
}

export type RecommendationPerLangModel = Record<LanguageOptions, RecommendationModel[]>;
