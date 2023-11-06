import { posthog } from 'posthog-js';

const usePostHog = () => {
  const { $posthog } = useNuxtApp();

  const sendEvent = (event: string, properties?: Parameters<typeof posthog.capture>[1]) => {
    if ($posthog) {
      const phog = $posthog();
      if (phog) {
        phog.capture(event, properties);
      }
    }
  };
  return {
    sendEvent,
  };
};

export default usePostHog;
