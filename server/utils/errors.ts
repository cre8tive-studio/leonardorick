// 403 - Forbidden
// 422 - Unprocessable Entity
export function createGenericError(statusMessage: string, statusCode = 403) {
  return createError({
    statusCode,
    statusMessage,
  });
}
