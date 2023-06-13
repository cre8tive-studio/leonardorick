export const LANGUAGES = ['en', 'pt-BR'] as const;
export type LanguageOptions = (typeof LANGUAGES)[number];
