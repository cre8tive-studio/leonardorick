import { Account, Client } from 'appwrite';

export const client = new Client();
let account: Account;

export function initClient(endpoint: string, project: string) {
  if (!account) {
    client.setEndpoint(endpoint).setProject(project);
    account = new Account(client);
  }
}

export function getAuth(): Account {
  return account;
}

export { ID } from 'appwrite';
