import { ID, Permission, Role } from 'node-appwrite';
import { isDefinedAndNotEmpty } from '@leonardorick/utils';
import { createGenericError } from '../utils/errors';
import { bypass } from '~/utils/js-utilities';

import useServerAppwrite from '~/composables/use-server-appwrite';

const {
  users,
  databases,
  databaseId,
  collections,
  queryAllowedEmail,
  getAuthUserWithEmail,
  getUserWithEmail,
  getSettings,
} = useServerAppwrite();

export default defineEventHandler(async (event) => {
  const { email, password, name: registerName } = await readBody(event);

  // if appwrite user already exists, or user on database alwready exists we don't want to create again
  const user = await getAuthUserWithEmail(email);
  const userDoc = await getUserWithEmail(email);

  if (isDefinedAndNotEmpty(user) || isDefinedAndNotEmpty(userDoc)) {
    throw createGenericError('User already exists');
  }

  const allowedEmail = await queryAllowedEmail(email);

  if (!isDefinedAndNotEmpty(allowedEmail)) {
    throw createGenericError('User not allowed');
  }

  const { $id: uid } = await createUser(email, password, registerName);
  const { stripeId, name, verified, availableDemos, subscriptionId } = allowedEmail;

  try {
    await databases.createDocument(
      databaseId,
      collections.users,
      uid,
      {
        uid,
        email,
        stripeId,
        name,
        verified,
        availableDemos,
        subscriptionId,
      },
      // while appwrite don't allow custom permissions per attribute
      // we don't add write permissions and perform any update we need
      // on the server side with the proper validations and the sdk api
      [Permission.read(Role.user(uid))]
    );
    return getSettings();
  } catch (err: any) {
    await users.delete(uid).catch(bypass);
    throw createGenericError(err.message);
  }
});

const createUser = async (email: string, password: string, name: string) => {
  try {
    // undefined so we don't need to send the phone number
    return await users.create(ID.unique(), email, undefined, password, name);
  } catch (err: any) {
    throw createGenericError(err.message);
  }
};
