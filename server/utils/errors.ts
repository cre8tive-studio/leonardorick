export function create403Error(statusMessage: string) {
  return createError({
    statusCode: 403, // Forbidden
    statusMessage,
  });
}
