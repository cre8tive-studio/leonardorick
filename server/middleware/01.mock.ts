import { promises } from 'node:fs';
import { resolve } from 'node:path';
import { isStringTrue } from '@leonardorick/utils';
import getPreviewsMetadata from '../../server/mocks/api/getPreviewsMetadata.json';
import getSubscription from '../../server/mocks/api/getSubscription.json';
import getCoversMetadata from '../../server/mocks/api/getCoversMetadata.json';

export default defineEventHandler(async (event) => {
  if (isStringTrue(process.env.USE_MOCKS)) {
    const { url } = event.node.req;

    if (url) {
      // validate file downloads
      const match = url.match(/^\/api\/(getCoverFile|getPreviewFile)\/(\d+)$/);
      if (match) {
        const [, type, id] = match; // type = 'getCoverFile' | 'getPreviewFile'
        const dir = type === 'getCoverFile' ? 'covers' : 'previews';

        const filePath = resolve(`server/mocks/audio/${dir}/${id}.mp3`);

        try {
          const buffer = await promises.readFile(filePath);

          event.node.res.setHeader('Content-Type', 'audio/mpeg'); // tell the browser it's an MP3
          // optional: force download instead of inline play
          // event.node.res.setHeader('Content-Disposition', `attachment; filename=${id}.mp3`);

          return buffer; // Nitro will send raw bytes
        } catch {
          throw createError({ statusCode: 404, statusMessage: `Mock MP3 ${id} not found` });
        }
        // validate regular endpoints
      } else if (Object.prototype.hasOwnProperty.call(DATA, url)) {
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
