import { Account, AppwriteException, Client, Databases, type Models } from 'appwrite';
import { useAppStore } from '~/store';
import type { SettingsClientModel, SettingsModel } from '~/types/settings.model';
import type { AppwriteUserModel, UserModel } from '~/types/user.model';
import type { UpvotesModel, UpvotesClientModel } from '~/types/upvotes.model';
import { parseUpvotes } from '~/utils/parsers/upvotes.parser';
import { parseSettings } from '~/utils/parsers/settings.parser';
import { parseReleases } from '~/utils/parsers/releases.parser';
import { isNotExpired, getExpireTime } from '~/utils/js-utilities';
import type { ReleaseModel } from '~/types/release.model';
import type { AudioModel } from '~/types/audio.model';
import type { SubscriptionModel } from '~/types/subscription.model';
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

  const { session: storedSession, settings, lastJWT, subscription, user } = toRefs(useAppStore());

  const { request } = useRequest();

  if (!account) {
    client.setEndpoint(endpoint).setProject(project);
    account = new Account(client);
    databases = new Databases(client);
  }

  const getCurrentSession = async (fresh = false) => {
    const empty = { session: null, user: null, subscription: null };
    if (!storedSession.value && !fresh) {
      return empty;
    }

    if (!fresh && storedSession.value && isNotExpired(getExpireTime(0, storedSession.value.expire))) {
      return { session: storedSession.value, user: user.value, subscription: subscription.value };
    }

    let session: Models.Session;

    try {
      session = await account.getSession('current');
    } catch (e) {
      if (e instanceof AppwriteException && [404, 401].includes(e.code)) {
        // we bypass this error because theres no way to avoid the error from happening. This is the way
        // stripe checks if the user is logged in or not and it returns a 404 if the user is not present
        return empty;
      }
      throw e;
    }

    if (session) {
      storedSession.value = session;
      const { user: u, subscription: s } = await updateUserAndSubscription(session);
      return { session, user: u, subscription: s };
    }
    return empty;
  };

  async function createEmailPasswordSession(...params: Parameters<typeof account.createEmailPasswordSession>) {
    const session = await account.createEmailPasswordSession(...params);
    storedSession.value = session;
    await updateUserAndSubscription(session);
    return session;
  }

  async function updateUserAndSubscription(session: Models.Session) {
    user.value = await databases.getDocument<AppwriteUserModel>(databaseId, usersCollection, session.userId);
    subscription.value = await request<SubscriptionModel>('/api/getSubscription', {
      method: 'post',
      body: { subscriptionId: user.value.subscriptionId },
      getJWT,
    });

    return { user: user.value, subscription: subscription.value };
  }

  const initSettings = async (st?: SettingsModel): Promise<SettingsClientModel> => {
    if (!settings.value) {
      if (st) {
        settings.value = parseSettings(st);
        return settings.value;
      }

      settings.value = await databases
        .getDocument<SettingsModel>(databaseId, settingsCollection, settingsDocument)
        .then(parseSettings);
    }
    return settings.value as SettingsClientModel;
  };

  const getUpvotes = async (): Promise<UpvotesClientModel> => {
    return databases.listDocuments<UpvotesModel>(databaseId, upvotesCollection).then(parseUpvotes);
  };

  const getReleasesMetadata = async (): Promise<AudioModel[]> => {
    return databases.listDocuments<ReleaseModel>(databaseId, releasesCollection).then(parseReleases);
  };

  const updateVotes = async (previewNumber: number, votes: string[]) => {
    return databases.updateDocument(databaseId, upvotesCollection, previewNumber.toString(), {
      votes,
    });
  };

  const removefeaturedPreview = async (previews: number[], previewNumber: number) => {
    const featuredPreviews = previews.filter((n) => n !== previewNumber);
    return request<void>('/api/updateUser', {
      authenticated: true,
      method: 'post',
      body: { featuredPreviews },
    });
  };

  const logout = async () => {
    const { session } = await getCurrentSession();
    if (session) {
      try {
        await account.deleteSession(session.$id);
      } catch (e) {
        if (e instanceof AppwriteException) {
          // if Unauthorized we just bypass because it means
          // the user already logged out on another tab
          if (e.code !== 401) {
            throw e;
          }
        }
      }
    }
    storedSession.value = null;
  };

  async function getJWT() {
    const { session } = await getCurrentSession();
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
  }

  return {
    auth: account,
    settings,
    getCurrentSession,
    createEmailPasswordSession,
    getJWT,
    getUpvotes,
    getReleasesMetadata,
    removefeaturedPreview,

    initSettings,
    updateVotes,
    logout,
  };
};

export default useAppwrite;
