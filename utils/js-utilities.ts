export function objectNotEmpty(obj: object) {
  return obj && typeof obj === 'object' && Object.keys(obj).length > 0;
}

export function localeRoute(route: string, locale?: string) {
  return `${route}${locale ? `?locale=${locale}` : ''}`;
}

export function bypass() {}

/**
 * Check if a value sent is defined and is not [] nor {}
 * @param {any} value
 */
export function isDefinedAndNotEmpty(value: any) {
  return (
    (value || value === false || value === 0) &&
    (typeof value === 'object' ? Object.keys(value).length > 0 : true)
  );
}

export function getRandomInt(max: number, startNumber = 0) {
  return Math.floor(Math.random() * max) + startNumber;
}
