import { Databases, Users, Client as ServerClient, Query } from 'node-appwrite';

import type { AllowedEmailModel } from '~/server/types/allowed-email.model';
import type { SettingsModel } from '~/types/settings.model';
import type { UserModel } from '~/types/user.model';

let serverClient: ServerClient;
let users: Users;
let databases: Databases;

const useServerAppwrite = () => {
  const { appwrite, public: publicConfig } = useRuntimeConfig();
  const {
    database,
    collectionUsers,
    collectionAllowedEmails,
    collectionSettings,
    documentSettings,
  } = appwrite;
  const { appwrite: publicAppwrite } = publicConfig;

  if (!serverClient) {
    serverClient = new ServerClient();
    serverClient
      .setEndpoint(publicAppwrite.endpoint)
      .setProject(publicAppwrite.project)
      .setKey(appwrite.apiKey);

    users = new Users(serverClient);
    databases = new Databases(serverClient);
  }

  const queryAllowedEmail = async (email: string) => {
    return databases
      .listDocuments<AllowedEmailModel>(database, collectionAllowedEmails, [
        Query.equal('email', [email]),
      ])
      .then((res) => res.documents[0]);
  };

  const getUserWithEmail = async (email: string) => {
    return databases
      .listDocuments<UserModel>(database, collectionUsers, [Query.equal('email', [email])])
      .then((res) => res.documents[0]);
  };

  const getSettings = async () => {
    return databases.getDocument<SettingsModel>(database, collectionSettings, documentSettings);
  };

  const getAuthUserWithEmail = async (email: string) => {
    return users.list().then((res) => res.users.find((u) => u.email === email));
  };

  return {
    users,
    databases,
    database,
    collections: {
      users: collectionUsers,
      allowedEmails: collectionAllowedEmails,
    },
    // functions
    queryAllowedEmail,
    getUserWithEmail,
    getSettings,
    getAuthUserWithEmail,
  };
};

export default useServerAppwrite;
