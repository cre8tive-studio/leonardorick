import { AppwriteException } from 'appwrite';
import * as Sentry from '@sentry/nuxt';
import { useToasterStore } from '~/store/toaster';

function captureSentry(e: unknown) {
  // todo: add logic to exclude some errors;
  Sentry.captureException(e);
}

function getInvalidArgumentName(message: string) {
  const regex = /Invalid `(.*?)` param:/;
  const match = message.match(regex);
  return match ? match[1] : null;
}

const useHandleError = () => {
  const toast = useToasterStore();
  const { t: $t, te: $te } = useI18n();

  function handleArgumentInvalidError(e: AppwriteException) {
    if (e.type === 'general_argument_invalid') {
      const argument = getInvalidArgumentName(e.message);
      if (argument) {
        toast.error({ text: $t(`error.general_argument_invalid_${argument}`) });
        return true;
      }
    }
    return false;
  }
  function handleError(e: any) {
    // eslint-disable-next-line no-console
    console.error(e);
    captureSentry(e);

    if (e instanceof AppwriteException) {
      if (handleArgumentInvalidError(e)) {
        return;
      }

      const key = `error.${e.type}`;
      toast.error({ text: $te(key) ? $t(key) : $t('error.generic') });
      return;
    }

    if (e.data?.data?.code) {
      toast.error({ text: $t(`error.${e.data.data.code}`) });
      return;
    }

    toast.error({ text: $t('error.generic') });
  }

  return { handleError };
};

export default useHandleError;
