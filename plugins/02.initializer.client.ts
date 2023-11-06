export default defineNuxtPlugin(async (_nuxtApp) => {
  const { getCurrentSession, initSettings } = useAppwrite();
  let initializerClientError = null;
  try {
    // i18n somehow doesn't work inside a server plugin so we
    // can only use this on client plugings
    useLang(_nuxtApp.$i18n);

    const session = await getCurrentSession(true);
    if (session) {
      await initSettings();
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
