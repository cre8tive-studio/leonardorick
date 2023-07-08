import EN from './utils/i18n/en.json';
import PT_BR from './utils/i18n/pt-BR.json';

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en: EN,
    'pt-BR': PT_BR,
  },
}));
