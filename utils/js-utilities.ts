export function objectNotEmpty(obj: object) {
  return obj && typeof obj === 'object' && Object.keys(obj).length > 0;
}
