// https://github.com/Serpentarius13/toast-tutorial
export type TToastStatus = 'success' | 'warning' | 'error';

interface IToast {
  text: string;
  status: TToastStatus;
  id: number;
}
type ToastPayload = { timeout?: number; text: string };

const createToast = (text: string, status: TToastStatus): IToast => ({
  text,
  status,
  id: Math.random() * 1000,
});

export const useToasterStore = defineStore('toaster-store', () => {
  const defaultTimeout = 5000;

  const state = reactive<{ toasts: IToast[] }>({
    toasts: [],
  });

  function updateState(payload: ToastPayload, status: TToastStatus) {
    const { text, timeout } = payload;

    const toast = createToast(text, status);

    state.toasts.push(toast);

    setTimeout(() => {
      state.toasts = state.toasts.filter((t) => t.id !== toast.id);
    }, timeout ?? defaultTimeout);
  }
  function success(payload: ToastPayload) {
    updateState(payload, 'success');
  }

  function warning(payload: ToastPayload) {
    updateState(payload, 'warning');
  }

  function error(payload: ToastPayload) {
    updateState(payload, 'error');
  }

  return {
    ...toRefs(state),
    success,
    warning,
    error,
  };
});
