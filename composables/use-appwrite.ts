import { Account, Client, Databases } from 'appwrite';
import { useAppStore } from '~/store';
import type { SettingsModel } from '~/types/settings.model';
import type { UserModel } from '~/types/user.model';
import type { UpvotesModel, UpvotesClientModel } from '~/types/upvotes.model';
import { parseUpvotes, parseSettings } from '~/utils/parsers';
export { ID } from 'appwrite';

let account: Account;
let databases: Databases;
const client = new Client();

const useAppwrite = () => {
  const { appwrite } = useRuntimeConfig().public;
  const {
    endpoint,
    project,
    databaseId,
    usersCollection,
    upvotesCollection,
    settingsCollection,
    settingsDocument,
  } = appwrite;

  const { sessionId, settings } = toRefs(useAppStore());

  if (!account) {
    client.setEndpoint(endpoint).setProject(project);
    account = new Account(client);
    databases = new Databases(client);
  }

  const getCurrentSession = async (firstTime = false) => {
    if (!sessionId.value && !firstTime) {
      return null;
    }
    return account.getSession('current').catch(bypass);
  };

  const initSettings = async (st?: SettingsModel) => {
    if (!settings.value) {
      if (st) {
        settings.value = st;
        return;
      }
      settings.value = await databases
        .getDocument<SettingsModel>(databaseId, settingsCollection, settingsDocument)
        .then(parseSettings);
    }
  };

  const getUser = async () => {
    const session = await getCurrentSession();
    if (session) {
      const uid = session.userId;
      return databases.getDocument<UserModel>(databaseId, usersCollection, uid);
    }
    return null;
  };

  const getUpvotes = async (): Promise<UpvotesClientModel> => {
    return databases.listDocuments<UpvotesModel>(databaseId, upvotesCollection).then(parseUpvotes);
  };

  const updateVotes = async (songNumber: number, votes: string[]) => {
    return databases.updateDocument(databaseId, upvotesCollection, songNumber.toString(), {
      votes,
    });
  };

  const logout = async () => {
    const session = await getCurrentSession();
    if (session) {
      await account.deleteSession(session.$id);
    }
    sessionId.value = '';
  };

  const getJWT = async () => {
    const session = await getCurrentSession();
    if (session) {
      return account.createJWT().then((res) => res.jwt);
    }
    return '';
  };

  return {
    auth: account,
    settings,
    getCurrentSession,
    getJWT,
    getUser,
    getUpvotes,

    initSettings,
    updateVotes,
    logout,
  };
};

export default useAppwrite;
