import { useLocalStorage } from '@vueuse/core';
import localforage from 'localforage';
import type { SettingsModel } from '~/types/settings.model';
import type { SubscriptionModel } from '~/types/subscription.model';

const useCleanCache = () => {
  const localStorageVersion = useLocalStorage('storage-version', 0);

  async function refreshCacheBasedOnStorageVersion(settings: SettingsModel) {
    // theres a globalUpdatedAt setting that is a date we use to remove everything
    // from indexedDB. It's important when we need to reset cache. Keep in mind that you
    // never should put this value too far from today as it would not allow the cache reset
    // to happen anymore
    if (settings.storageVersion > localStorageVersion.value) {
      localStorageVersion.value = settings.storageVersion;
      await localforage.clear();
    }
  }

  async function refreshCacheBasedOnSubscription(subscription: SubscriptionModel) {
    if (subscription.status === 'canceled') {
      localforage.iterate((_, key) => {
        if (key.includes('auth-')) {
          localforage.removeItem(key);
        }
      });
    }
  }

  return { refreshCacheBasedOnStorageVersion, refreshCacheBasedOnSubscription };
};

export default useCleanCache;
