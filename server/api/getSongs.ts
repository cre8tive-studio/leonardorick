import useServerAppwrite from '~/composables/use-server-appwrite';

const { getUser } = useServerAppwrite();

export default defineEventHandler(async (event) => {
  const { userId } = event.context.auth;

  if (!userId) {
    throw create403Error('User not allowed');
  }

  const { availableSongs } = await getUser(userId);
  // todo: implement call to storage to get files
  return availableSongs;
  // check if that subscription id is active and the email is the same
  // sended by the user. If so, return songs
});
