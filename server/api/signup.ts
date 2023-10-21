import { ID, Permission, Role } from 'node-appwrite';
import { create403Error } from '../utils/errors';
import { bypass, isDefinedAndNotEmpty } from '~/utils/js-utilities';
import useServerAppwrite from '~/composables/use-server-appwrite';

const {
  users,
  databases,
  database,
  collections,
  queryAllowedEmail,
  getAuthUserWithEmail,
  getUserWithEmail,
  getSettings,
} = useServerAppwrite();

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  // if appwrite user already exists, or user on database alwready exists we don't want to create again
  const user = await getAuthUserWithEmail(email);
  const userDoc = await getUserWithEmail(email);

  if (isDefinedAndNotEmpty(user) || isDefinedAndNotEmpty(userDoc)) {
    throw create403Error('User already exists');
  }

  const allowedEmail = await queryAllowedEmail(email);

  if (!isDefinedAndNotEmpty(allowedEmail)) {
    throw create403Error('User not allowed');
  }

  const { $id: uid } = await createUser(email, password);
  const { stripeId, name, verified, availableSongs } = allowedEmail;

  try {
    await databases.createDocument(
      database,
      collections.users,
      uid,
      {
        uid,
        email,
        stripeId,
        name,
        verified,
        availableSongs,
      },
      // while appwrite don't allow custom permissions per attribute
      // we don't add write permissions and perform any update we need
      // on the server side with the proper validations and the sdk api
      [Permission.read(Role.user(uid))]
    );
    return getSettings();
  } catch (err: any) {
    await users.delete(uid).catch(bypass);
    throw create403Error(err.message);
  }
});

const createUser = async (email: string, password: string) => {
  try {
    // undefined so we don't need to send the phone number
    return await users.create(ID.unique(), email, undefined, password);
  } catch (err: any) {
    throw create403Error(err.message);
  }
};
