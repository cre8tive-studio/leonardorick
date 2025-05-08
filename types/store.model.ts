import type { Models } from 'appwrite';
import type { QuoteModel } from './quote.model';
import type { RecommendationModel } from './recommendation-model';
import type { SettingsModel } from './settings.model';
import type { GeneralsModel } from './generals.model';
import type { PersonalInfoModel } from './personal-info.model';
import type { ExperienceModel } from './experience.model';
import type { SubscriptionModel } from './subscription.model';
import type { UserModel } from './user.model';
import type { LanguageOptions } from '~/utils/constants/languages';

interface CacheModel {
  recommendations: RecommendationModel[];
  quotes: QuoteModel[];
  experiences: ExperienceModel[];
  generals: GeneralsModel[];
}

export interface StoreModel {
  recommendations: RecommendationModel[];
  quotes: QuoteModel[];
  experiences: ExperienceModel[];
  generals: GeneralsModel[];
  lang: LanguageOptions;
  settings: SettingsModel | null;
  session: Models.Session | null;
  subscription: SubscriptionModel | null;
  user: UserModel | null;
  personalInfo: PersonalInfoModel | null;
  lastJWT: {
    jwt: string;
    expire: number;
  };
  cache: Record<LanguageOptions, CacheModel>;
  isContentLoaded: boolean;
  isContentErrored: boolean;
}
