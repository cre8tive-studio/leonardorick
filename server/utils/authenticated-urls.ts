import { useFetch } from 'nuxt/app';

const _AUTHENTICATED_URLS: Array<Parameters<typeof useFetch>[0]> = [
  '/api/getSongs',
  '/api/getSubscription',
];
export const AUTHENTICATED_URLS = new Set(_AUTHENTICATED_URLS);
