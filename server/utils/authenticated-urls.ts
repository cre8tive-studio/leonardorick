import { useFetch } from 'nuxt/app';

const _AUTHENTICATED_URLS: Array<Parameters<typeof useFetch>[0]> = [
  '/api/getPreviewsMetadata',
  '/api/getCoversMetadata',
  '/api/getPreviewFile',
  '/api/getCoverFile',
  '/api/renewSubscription',
  '/api/updateUser',
];

// in some urls we might need authentication even without a active subscription and this logic is for hanlding that
const _AUTHENTICATED_WITHTOUT_SUBSCRIPTION_URLS: Array<Parameters<typeof useFetch>[0]> = ['/api/renewSubscription'];

export const AUTHENTICATED_URLS = new Set(_AUTHENTICATED_URLS);
export const AUTHENTICATED_WITHTOUT_SUBSCRIPTION_URLS = new Set(_AUTHENTICATED_WITHTOUT_SUBSCRIPTION_URLS);

export const DYNAMIC_AUTHENTICATED_URLS: Array<Parameters<typeof useFetch>[0]> = [
  '/api/getPreviewFile/:id',
  '/api/getCoverFile/:id',
];
