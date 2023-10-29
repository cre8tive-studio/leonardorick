export default defineNuxtPlugin(async (_nuxtApp) => {
  const { getCurrentSession, initSettings } = useAppwrite();
  let initializerClientError = null;
  try {
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
