import { isStringTrue } from '@leonardorick/utils';
import getPreviewsMetadata from '../../server/mocks/api/getPreviewsMetadata.json';
import getSubscription from '../../server/mocks/api/getSubscription.json';
import getCoversMetadata from '../../server/mocks/api/getCoversMetadata.json';

export default defineEventHandler(async (event) => {
  if (isStringTrue(process.env.USE_MOCKS)) {
    const { url } = event.node.req;
    if (url) {
      if (Object.keys(DATA).includes(url)) {
        return DATA[url];
      }
    }
  }
});

const DATA: Record<string, unknown> = {
  '/api/getSubscription': getSubscription,
  '/api/getPreviewsMetadata': getPreviewsMetadata,
  '/api/getCoversMetadata': getCoversMetadata,
};
