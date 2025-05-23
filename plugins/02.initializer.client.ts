import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import localforage from 'localforage';
import { isStringTrue } from '@leonardorick/utils';
import { useAppStore } from '~/store';
import { COLORS } from '~/utils/constants/colors';
import useSetupMSWWorker from '~/server/mocks/browser';

export default defineNuxtPlugin(async (_nuxtApp) => {
  const { environment, baseUrl, clientVersion, useMocks } = useRuntimeConfig().public;

  // ? msw mock initializer
  if (isStringTrue(useMocks)) {
    const { worker } = useSetupMSWWorker();
    worker.start({ onUnhandledRequest: 'bypass' });
  }

  const { personalInfo } = toRefs(useAppStore());

  printConsoleIntroduction(environment, baseUrl, clientVersion, personalInfo.value?.links.linkedin);

  const { refreshCacheBasedOnStorageVersion, refreshCacheBasedOnSubscription } = useCleanCache();
  const { getCurrentSession, initSettings } = useAppwrite();
  let initializerClientError = null;
  try {
    // gsap
    gsap.registerPlugin(ScrollTrigger);
    // localforage driver
    localforage.setDriver(localforage.INDEXEDDB);

    // appwritee
    const settings = await initSettings();
    await refreshCacheBasedOnStorageVersion(settings);

    const { subscription } = await getCurrentSession(true);
    if (subscription) {
      await refreshCacheBasedOnSubscription(subscription);
    }
  } catch (error) {
    initializerClientError = error;
  }
  return {
    provide: {
      initializerClientError,
    },
  };
});

function printConsoleIntroduction(env: string, baseUrl: string, clientVersion: string, linkedin?: string) {
  // eslint-disable-next-line no-console
  console.log('Version:', clientVersion);
  if (!isProduction(env)) return;

  // eslint-disable-next-line no-console
  console.log(
    `%c${baseUrl}%c\nOh, so you thought you could sneak onto my website undetected, huh? Nice try! 😏\nBut seriously, If you have any questions about the features on this website, feel free to shoot me a message on LinkedIn: ${linkedin}.%c\nSincerely,%c\nLeonardo Rick`,
    'font-size: 1.5rem; font-weight:bold; padding: 16px; padding-bottom: 0px;',
    `font-size: 12px; color: ${COLORS.mainDarkText}; padding-right: 200px; padding-bottom: 16px; padding-left: 16px`,
    'font-size: 12px; padding-left: 16px;',
    'font-size: 12px; font-weight: 700; padding-left: 16px;'
  );
}
