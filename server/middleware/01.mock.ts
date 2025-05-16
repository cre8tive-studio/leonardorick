import { promises } from 'node:fs';
import { resolve } from 'node:path';
import { isStringTrue } from '@leonardorick/utils';
import getPreviewsMetadata from '../../server/mocks/api/getPreviewsMetadata.json';
import getSubscription from '../../server/mocks/api/getSubscription.json';
import getCoversMetadata from '../../server/mocks/api/getCoversMetadata.json';

import personalInfo from '../../server/mocks/api/personal-info.json';
import recommendationsEn from '../../server/mocks/api/recommendations?locale=en.json';
import quotesEn from '../../server/mocks/api/quotes?locale=en.json';
import generalsEn from '../../server/mocks/api/generals?locale=en.json';
import experiencesEn from '../../server/mocks/api/experiences?locale=en.json';
import recommendationsPtBr from '../../server/mocks/api/recommendations?locale=pt-BR.json';
import quotesPtBr from '../../server/mocks/api/quotes?locale=pt-BR.json';
import generalsPtBr from '../../server/mocks/api/generals?locale=pt-BR.json';
import experiencesPtBr from '../../server/mocks/api/experiences?locale=pt-BR.json';

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
          // ? request file if mock is not found. If a request needs to be done
          // ? you need to comment '/api/getSubscription' so authenticated requests work
          // eslint-disable-next-line no-console
          console.warn(`Mock MP3 ${id} not found`);
          // throw createError({ statusCode: 404, statusMessage: `Mock MP3 ${id} not found` });
        }
        // validate regular endpoints
      } else if (Object.prototype.hasOwnProperty.call(DATA, url)) {
        return DATA[url];
      }
    }
  }
});

const DATA: Record<string, unknown> = {
  '/api/getSubscription': getSubscription, // ? always comment this one if you want authenticated requests to work
  '/api/getPreviewsMetadata': getPreviewsMetadata,
  '/api/getCoversMetadata': getCoversMetadata,
  '/api/personal-info': personalInfo,
  '/api/recommendations?locale=en': recommendationsEn,
  '/api/quotes?locale=en': quotesEn,
  '/api/generals?locale=en': generalsEn,
  '/api/experiences?locale=en': experiencesEn,
  '/api/recommendations?locale=pt-BR': recommendationsPtBr,
  '/api/quotes?locale=pt-BR': quotesPtBr,
  '/api/generals?locale=pt-BR': generalsPtBr,
  '/api/experiences?locale=pt-BR': experiencesPtBr,
};
