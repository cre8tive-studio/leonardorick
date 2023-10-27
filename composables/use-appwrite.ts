import { ref } from 'vue';
import { Account, Client, Databases } from 'appwrite';
import { useAppStore } from '~/store';
import type { SettingsModel } from '~/types/settings.model';
import type { UserModel } from '~/types/user.model';
export { ID } from 'appwrite';

let account: Account;
let databases: Databases;
const client = new Client();

const useAppwrite = () => {
  const { appwrite } = useRuntimeConfig().public;
  const { endpoint, project, databaseId, usersCollection } = appwrite;
  const settings = ref<SettingsModel | null>(null);

  const { sessionId } = toRefs(useAppStore());

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

  const setSettings = (st: SettingsModel | null) => {
    if (!settings.value && st) {
      settings.value = st;
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
    setSettings,

    logout,
  };
};

export default useAppwrite;
