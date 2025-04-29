import { useRouter } from 'vue-router';

export function useSafeBack() {
  const router = useRouter();

  function safeBack() {
    const previousUrl = document.referrer;
    const currentHost = window.location.host;

    if (previousUrl.includes(currentHost)) {
      router.back();
    } else {
      router.push('/');
    }
  }

  return { safeBack };
}
