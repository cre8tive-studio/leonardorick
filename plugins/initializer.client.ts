export default defineNuxtPlugin(async (_nuxtApp) => {
  const auth = useAppwrite();
  let sessionId = '';
  let initializerClientError = null;
  try {
    const session = await auth.getSession('current');
    sessionId = session.$id;
  } catch (error) {
    initializerClientError = error;
  }
  return {
    provide: {
      sessionId,
      initializerClientError,
    },
  };
});
