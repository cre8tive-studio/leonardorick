import { useAppStore } from '~/store';

export default defineNuxtPlugin(async (_nuxtApp) => {
  const { getCurrentSession, initSettings } = useAppwrite();
  const { sessionId } = toRefs(useAppStore());
  let initializerClientError = null;
  try {
    useLang(_nuxtApp.$i18n);

    const session = await getCurrentSession(true);
    if (session) {
      sessionId.value = session.$id;
      await initSettings();
    }
  } catch (error) {
    initializerClientError = error;
  }
  return {
    provide: {
      sessionId: sessionId.value,
      initializerClientError,
    },
  };
});
