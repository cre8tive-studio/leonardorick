import { Account, Client, Databases } from 'appwrite';
import { useAppStore } from '~/store';
import type { SettingsModel } from '~/types/settings.model';
import type { UserModel } from '~/types/user.model';
import type { UpvotesModel, UpvotesClientModel } from '~/types/upvotes.model';
import { parseUpvotes } from '~/utils/parsers/upvotes.parser';
import { parseSettings } from '~/utils/parsers/settings.parser';
import { parseReleases } from '~/utils/parsers/releases.parser';
import { isNotExpired, getExpireTime } from '~/utils/js-utilities';
import type { ReleaseModel } from '~/types/release.model';
import type { AudioModel } from '~/types/audio.model';
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
    releasesCollection,
    settingsDocument,
  } = appwrite;

  const { session: storedSession, settings, lastJWT } = toRefs(useAppStore());

  if (!account) {
    client.setEndpoint(endpoint).setProject(project);
    account = new Account(client);
    databases = new Databases(client);
  }

  const getCurrentSession = async (fresh = false) => {
    if (!storedSession.value && !fresh) {
      return null;
    }

    if (!fresh && storedSession.value && isNotExpired(getExpireTime(0, storedSession.value.expire))) {
      return storedSession.value;
    }

    return account
      .getSession('current')
      .then((session) => {
        storedSession.value = session;
        return session;
      })
      .catch(bypass);
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

  const getReleasesMetadata = async (): Promise<AudioModel[]> => {
    return databases.listDocuments<ReleaseModel>(databaseId, releasesCollection).then(parseReleases);
  };

  const updateVotes = async (demoNumber: number, votes: string[]) => {
    return databases.updateDocument(databaseId, upvotesCollection, demoNumber.toString(), {
      votes,
    });
  };

  const logout = async () => {
    const session = await getCurrentSession();
    if (session) {
      await account.deleteSession(session.$id);
    }
    storedSession.value = null;
  };

  const getJWT = async () => {
    const session = await getCurrentSession();
    if (session) {
      if (lastJWT.value.jwt && isNotExpired(lastJWT.value.expire)) {
        return lastJWT.value.jwt;
      }
      return account.createJWT().then((res) => {
        lastJWT.value = {
          jwt: res.jwt,
          expire: getExpireTime(),
        };
        return res.jwt;
      });
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
    getReleasesMetadata,

    initSettings,
    updateVotes,
    logout,
  };
};

export default useAppwrite;
