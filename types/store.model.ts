import type { Models } from 'appwrite';
import type { QuoteModel } from './quote.model';
import type { RecommendationModel } from './recommendation-model';
import type { SettingsClientModel } from './settings.model';
import type { GeneralsModel } from './generals.model';
import type { PersonalInfoModel } from './personal-info.model';
import type { LanguageOptions } from '~/utils/constants/languages';
import type { ExperienceModel } from './experience.model';

export interface StoreModel {
  recommendations: RecommendationModel[];
  quotes: QuoteModel[];
  experiences: ExperienceModel[];
  generals: GeneralsModel[];
  lang: LanguageOptions;
  settings: SettingsClientModel | null;
  session: Models.Session | null;
  personalInfo: PersonalInfoModel | null;
  lastJWT: {
    jwt: string;
    expire: number;
  };
  isContentLoaded: boolean;
  isContentErrored: boolean;
}
