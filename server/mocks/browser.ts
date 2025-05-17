import { setupWorker } from 'msw/browser';
import useHandlers from './handlers';

const useSetupMSWWorker = () => {
  const { handlers } = useHandlers();
  const worker = setupWorker(...handlers);
  return { worker };
};

export default useSetupMSWWorker;
