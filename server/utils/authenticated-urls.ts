import { useFetch } from 'nuxt/app';

const _AUTHENTICATED_URLS: Array<Parameters<typeof useFetch>[0]> = [
  '/api/getPreviewsMetadata',
  '/api/getSubscription',
  '/api/getPreviewFile',
];
export const AUTHENTICATED_URLS = new Set(_AUTHENTICATED_URLS);

export const DYNAMIC_AUTHENTICATED_URLS: Array<Parameters<typeof useFetch>[0]> = ['/api/getPreviewFile/:id'];
