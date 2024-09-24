import type { I18n } from 'vue-i18n';
import type { WritableComputedRefWithControl } from '@vueuse/core';
import type { LanguageOptions } from '~/utils/constants/languages';
interface CustomI18n extends Omit<I18n, 'any-methods-not-required'> {
  locale: WritableComputedRefWithControl<LanguageOptions>;
  setLocale: (locale: LanguageOptions) => void;
  // Add other properties or methods you expect to use
}

export type i18nModel = CustomI18n;
