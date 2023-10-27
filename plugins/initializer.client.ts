import { useAppStore } from '~/store';

export default defineNuxtPlugin(async (_nuxtApp) => {
  const { getCurrentSession } = useAppwrite();
  const { sessionId } = toRefs(useAppStore());
  let initializerClientError = null;
  try {
    const session = await getCurrentSession(true);
    if (session) {
      sessionId.value = session.$id;
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
