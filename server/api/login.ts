import { isDefinedAndNotEmpty } from '@leonardorick/utils';
import { createGenericError } from '../utils/errors';
import useServerAppwrite from '~/composables/use-server-appwrite';

const { users, queryAllowedEmail, getAuthUserWithEmail, getSettings } = useServerAppwrite();

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event);

  try {
    const allowedEmail = await queryAllowedEmail(email);

    if (!isDefinedAndNotEmpty(allowedEmail)) {
      const user = await getAuthUserWithEmail(email);
      if (user) {
        await users.delete(user.$id);
        throw createGenericError('trying to login with a user not allowed!');
      }
      // if user is not on allowed emails but also not on appwrite, we do nothing
      // and let the appwrrite client side trying to login to handle the error
    }
  } catch (err: any) {
    throw createGenericError(err.message);
  }
  return getSettings();
});
