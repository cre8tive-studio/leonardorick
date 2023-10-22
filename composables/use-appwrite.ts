import { ref } from 'vue';
import { Account, Client, Databases } from 'appwrite';
import { SettingsModel } from '~/types/settings.model';
import type { UserModel } from '~/types/user.model';
import { useAppStore } from '~/store';
export { ID } from 'appwrite';

let account: Account;
let databases: Databases;
const client = new Client();

const useAppwrite = () => {
  const { appwrite } = useRuntimeConfig().public;
  const { database, usersCollection } = appwrite;
  const settings = ref<SettingsModel | null>(null);

  const { sessionId } = toRefs(useAppStore());
  const userId = ref('');

  if (!account) {
    client.setEndpoint(appwrite.endpoint).setProject(appwrite.project);
    account = new Account(client);
    databases = new Databases(client);
  }

  const getCurrentUser = async () => {
    return databases.getDocument<UserModel>(database, usersCollection, userId.value);
  };

  const getCurrentSession = async () => {
    return await account.getSession('current').catch(bypass);
  };

  const setSettings = (st: SettingsModel | null) => {
    if (!settings.value && st) {
      settings.value = st;
    }
  };

  const logout = async () => {
    const session = await getCurrentSession();
    if (session) {
      await account.deleteSession(session.$id);
    }
    sessionId.value = '';
  };

  return {
    auth: account,
    settings,
    getCurrentUser,
    getCurrentSession,

    setSettings,

    logout,
  };
};

export default useAppwrite;
