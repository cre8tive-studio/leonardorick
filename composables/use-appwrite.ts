import { Account, Client } from 'appwrite';
export { ID } from 'appwrite';

let account: Account;
const client = new Client();

const useAppwrite = () => {
  const { appwrite } = useRuntimeConfig().public;
  if (!account) {
    client.setEndpoint(appwrite.endpoint).setProject(appwrite.project);
    account = new Account(client);
  }

  return account;
};

export default useAppwrite;
