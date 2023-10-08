export function getFormattedLocale(locale?: ReturnType<typeof getQuery>): string {
  return locale?.toString().replace('-', '_') || 'en';
}
