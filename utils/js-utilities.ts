export function objectNotEmpty(obj: object) {
  return obj && typeof obj === 'object' && Object.keys(obj).length > 0;
}

export function localeRoute(route: string, locale?: string) {
  return `${route}${locale ? `?locale=${locale}` : ''}`;
}
