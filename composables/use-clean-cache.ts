import { useLocalStorage } from '@vueuse/core';
import localforage from 'localforage';
import type { SettingsClientModel } from '~/types/settings.model';
import type { SubscriptionModel } from '~/types/subscription.model';

const useCleanCache = () => {
  const localUpdatedAt = useLocalStorage('local-updated-at', new Date());

  async function refreshCacheBasedOnGlobalUpdateAt(settings: SettingsClientModel) {
    // theres a globalUpdatedAt setting that is a date we use to remove everything
    // from indexedDB. It's important when we need to reset cache. Keep in mind that you
    // never should put this value too far from today as it would not allow the cache reset
    // to happen anymore
    if (settings.globalUpdatedAt > localUpdatedAt.value) {
      localUpdatedAt.value = settings.globalUpdatedAt;
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

  return { refreshCacheBasedOnGlobalUpdateAt, refreshCacheBasedOnSubscription };
};

export default useCleanCache;
