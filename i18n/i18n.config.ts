import EN from './locales/en.json';
import PT_BR from './locales/pt-BR.json';

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: EN,
    'pt-BR': PT_BR,
  },
}));
