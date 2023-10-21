import useServerAppwrite from '~/composables/use-server-appwrite';
import { isDefinedAndNotEmpty } from '~/utils/js-utilities';

const { users, queryAllowedEmail, getAuthUserWithEmail, getSettings } = useServerAppwrite();

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event);

  const allowedEmail = await queryAllowedEmail(email);

  if (!isDefinedAndNotEmpty(allowedEmail)) {
    const user = await getAuthUserWithEmail(email);
    if (user) {
      await users.delete(user.$id);
      throw create403Error('trying to login with a user not allowed!');
    }
    // if user is not on allowed emails but  also not on appwrite, we do nothing
    // and let the appwrrite client side trying to login to handle the error
  }
  return getSettings();
});
