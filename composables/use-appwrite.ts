import { Account, Client } from 'appwrite';
import { SettingsModel } from '~/types/settings.model';
export { ID } from 'appwrite';

let account: Account;
const client = new Client();

const useAppwrite = () => {
  const settings = ref<SettingsModel | null>(null);
  const { appwrite } = useRuntimeConfig().public;
  if (!account) {
    client.setEndpoint(appwrite.endpoint).setProject(appwrite.project);
    account = new Account(client);
  }

  const setSettings = (st: SettingsModel | null) => {
    if (!settings.value && st) {
      settings.value = st;
    }
  };

  return {
    auth: account,
    setSettings,
    settings,
  };
};

export default useAppwrite;
