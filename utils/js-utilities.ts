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

export function isNotExpired(time: number) {
  return !!time && time > new Date().getTime();
}

export function getExpireTime(time?: number | string | Date, minutes = 15) {
  const t = time ? getNumberTime(time) : new Date().getTime();
  return t + minutes * 60 * 1000;
}

function getNumberTime(time?: number | string | Date): number {
  let finalTime = time as number;
  if (typeof time === 'string') {
    finalTime = new Date(time).getTime();
  } else if (time instanceof Date) {
    finalTime = time.getTime();
  }
  return finalTime;
}
