import { UPDATABLE_USER_KEYS, type UserModel } from '../../types/user.model';
import useServerAppwrite from '~/composables/use-server-appwrite';

const { updateUser } = useServerAppwrite();
export default defineEventHandler(async (event) => {
  if (!event.context.auth) {
    throw createGenericError('Request require authentication');
  }

  if (!event.context.auth?.userId) {
    throw createGenericError('User not allowed');
  }

  const { userId } = event.context.auth;
  const body = await readBody(event);

  for (const [key, value] of Object.entries(body)) {
    if (!Object.prototype.hasOwnProperty.call(UPDATABLE_USER_KEYS, key)) {
      throw createGenericError(`Unable to update user with specified property in the payload: ${key}`);
    }

    if (value && typeof UPDATABLE_USER_KEYS[key as keyof UserModel] !== typeof value) {
      throw createGenericError(`Wrong type of property in the payload: ${key}`);
    }
  }

  return updateUser(userId, body);
});
