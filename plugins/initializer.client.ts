import { initClient } from '~/utils/auth';

export default defineNuxtPlugin(async (_nuxtApp) => {
  const { appwrite } = useRuntimeConfig().public;
  initClient(appwrite.endpoint, appwrite.project);

  const auth = getAuth();
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
