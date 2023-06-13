export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      welcome: 'Welcome',
      english: 'English',
      portuguese: 'Portuguese',
    },
    'pt-BR': {
      welcome: 'Bem Vindo',
      english: 'Inglês',
      portuguese: 'Português',
    },
  },
}));
