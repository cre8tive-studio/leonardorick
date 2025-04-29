import { AppwriteException } from 'appwrite';
import * as Sentry from '@sentry/nuxt';
import { useToasterStore } from '~/store/toaster';

function captureSentry(e: unknown) {
  // todo: add logic to exclude some errors;
  Sentry.captureException(e);
}

const useHandleError = () => {
  const toast = useToasterStore();
  const { t: $t, te: $te } = useI18n();

  function handleError(e: unknown) {
    // eslint-disable-next-line no-console
    console.error(e);
    captureSentry(e);

    if (e instanceof AppwriteException) {
      const key = `error.${e.type}`;
      toast.error({ text: $te(key) ? $t(key) : $t('error.generic') });
      return;
    }

    toast.error({ text: $t('error.generic') });
  }

  return { handleError };
};

export default useHandleError;
