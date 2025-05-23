import { Databases, Users, Client as ServerClient, Account as ServerAccount, Query, Storage } from 'node-appwrite';

import type { AllowedEmailModel } from '~/server/types/allowed-email.model';
import type { AppwriteSettingsModel } from '~/types/settings.model';
import type { AppwriteUserModel, UpdatableUserModel } from '~/types/user.model';
import { parseSettings } from '~/utils/parsers/settings.parser';

let serverClient: ServerClient;
let users: Users;
let databases: Databases;
let storage: Storage;

const useServerAppwrite = () => {
  const { appwrite, public: publicConfig } = useRuntimeConfig();
  const { allowedEmailsCollection, previewsCollection, coversCollection, bucketId } = appwrite;
  const { appwrite: publicAppwrite } = publicConfig;
  const { endpoint, project, databaseId, usersCollection, settingsCollection, releasesCollection, settingsDocument } =
    publicAppwrite;

  if (!serverClient) {
    serverClient = new ServerClient();
    serverClient.setEndpoint(endpoint).setProject(project).setKey(appwrite.apiKey);

    users = new Users(serverClient);
    databases = new Databases(serverClient);
    storage = new Storage(serverClient);
  }

  /**
   * used mainly to validate if requests are authenticated as exemplified in
   * https://appwrite.io/docs/products/auth/jwt
   * @param jwt string generated from the client with createJWT()
   * @returns ServerAccount
   */
  const getLimitedAccount = (jwt: string) => {
    const client = new ServerClient();
    client.setEndpoint(endpoint).setProject(project).setJWT(jwt);
    return new ServerAccount(client);
  };

  const queryAllowedEmail = async (email: string) => {
    return databases
      .listDocuments<AllowedEmailModel>(databaseId, allowedEmailsCollection, [Query.equal('email', [email])])
      .then((res) => res.documents[0] as AllowedEmailModel);
  };

  const getUserWithEmail = async (email: string) => {
    return databases
      .listDocuments<AppwriteUserModel>(databaseId, usersCollection, [Query.equal('email', [email])])
      .then((res) => res.documents[0] as AppwriteUserModel);
  };

  const getUser = async (uid: string) => {
    return databases.getDocument<AppwriteUserModel>(databaseId, usersCollection, uid);
  };

  const updateUser = async (uid: string, user: Partial<UpdatableUserModel>) => {
    return databases.updateDocument(databaseId, usersCollection, uid, user);
  };

  const getSettings = async () => {
    return databases
      .getDocument<AppwriteSettingsModel>(databaseId, settingsCollection, settingsDocument)
      .then(parseSettings);
  };

  const getAuthUserWithEmail = async (email: string) => {
    return users.list().then((res) => res.users.find((u) => u.email === email));
  };

  return {
    users,
    databases,
    storage,

    databaseId,
    bucketId,
    collections: {
      users: usersCollection,
      allowedEmails: allowedEmailsCollection,
      previews: previewsCollection,
      covers: coversCollection,
      releases: releasesCollection,
      settings: settingsCollection,
    },

    documents: {
      settings: settingsDocument,
    },

    // functions
    getLimitedAccount,

    queryAllowedEmail,
    getUserWithEmail,
    getSettings,
    getAuthUserWithEmail,
    getUser,
    updateUser,
  };
};

export default useServerAppwrite;
