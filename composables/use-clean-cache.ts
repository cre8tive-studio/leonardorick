import { useLocalStorage } from '@vueuse/core';
import localforage from 'localforage';
import type { SettingsClientModel } from '~/types/settings.model';

const useCleanCache = () => {
  const localUpdatedAt = useLocalStorage('local-updated-at', new Date());

  const refreshCacheBasedOnGlobalUpdateAt = async (settings: SettingsClientModel) => {
    // theres a globalUpdatedAt setting that is a date we use to remove everything
    // from indexedDB. It's important when we need to reset cache
    if (settings.globalUpdatedAt > localUpdatedAt.value) {
      localUpdatedAt.value = settings.globalUpdatedAt;
      await localforage.clear();
    }
  };

  return { refreshCacheBasedOnGlobalUpdateAt };
};

export default useCleanCache;
