import type { QuoteModel } from './quote.model';
import type { RecommendationModel } from './recommendation-model';
import type { SettingsClientModel } from './settings.model';
import type { LanguageOptions } from '~/utils/constants/languages';
export interface StoreModel {
  recommendations: RecommendationModel[];
  quotes: QuoteModel[];
  lang: LanguageOptions;
  settings: SettingsClientModel | null;
  sessionId: string;
  loaded: boolean;
  lastJWT: {
    jwt: string;
    createdAt: number;
  };
}
