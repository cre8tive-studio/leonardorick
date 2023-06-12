import { WritableComputedRef } from 'nuxt/dist/app/compat/capi';
import { IdValueModel } from './id-value';

export interface StoreModel {
  quotes: IdValueModel[];
  lang: ComputedRef<WritableComputedRef<string>>;
  loading: boolean;
}
