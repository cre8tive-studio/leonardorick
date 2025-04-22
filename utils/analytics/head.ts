import type { LanguageOptions } from '../constants/languages';

let url = import.meta.client ? window.location.href.split('?')[0] : process.env.VUE_APP_BASE_URL;

// if the last char is not a '/', then we add it
if (url && url[url.length - 1] !== '/') {
  url += '/';
}

const defaultInfo = {
  title: 'Leonardo Rick - Software Engineer',
  description: 'Leonardo Rick Portfolio',
  url: url || '',
  ogImage: `${url}/meta/og-image.png`,
};

const musicInfo = {
  title: 'Leonardo Rick - Singer & Songwriter',
  description: 'Leonardo Rick Music Portifolio',
  url: `${url}music`,
  ogImage: `${url}meta/og-image-music.png`,
};

const defaultBrInfo = {
  title: 'Leonardo Rick - Engenheiro de Software',
  description: 'Portifólio de Leonardo Rick',
  url: `${url}`,
  ogImage: `${url}meta/og-image.png`,
};

const musicBrInfo = {
  title: 'Leonardo Rick - Cantor e Compositor',
  description: 'Portifólio Musical de Leonardo Rick',
  url: `${url}music`,
  ogImage: `${url}meta/og-image-music.png`,
};
/**
 * add external scripts here. if it's inside public folder just add it like
 * /imports/some.js considering a /imports folder inside public/ folder
 */
const SCRIPTS = {
  // script: [{ src: '' }],
};

const _DEFAULT_HEAD = {
  ...SCRIPTS,
  title: defaultInfo.title,
  htmlAttrs: {
    lang: 'en' as LanguageOptions,
  },
  meta: [
    { name: 'description', content: defaultInfo.description },

    { hid: 'og:title', property: 'og:title', content: defaultInfo.title },
    { hid: 'og:url', property: 'og:url', content: defaultInfo.url },
    { hid: 'og:description', property: 'og:description', content: defaultInfo.description },
    { hid: 'og:image', property: 'og:image', content: defaultInfo.ogImage },

    // twitter card
    { hid: 'twitter:title', name: 'twitter:title', content: defaultInfo.title },
    { hid: 'twitter:url', name: 'twitter:url', content: defaultInfo.url },
    { hid: 'twitter:description', name: 'twitter:description', content: defaultInfo.description },
    { hid: 'twitter:image', name: 'twitter:image', content: defaultInfo.ogImage },
  ],
  charset: 'utf-8',
  link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }],
};

const _BR_HEAD = {
  ...SCRIPTS,
  title: defaultBrInfo.title,
  htmlAttrs: {
    lang: 'pt-BR' as LanguageOptions,
  },
  meta: [
    { name: 'description', content: defaultBrInfo.description },

    { hid: 'og:title', property: 'og:title', content: defaultBrInfo.title },
    { hid: 'og:url', property: 'og:url', content: defaultBrInfo.url },
    { hid: 'og:description', property: 'og:description', content: defaultBrInfo.description },
    { hid: 'og:image', property: 'og:image', content: defaultBrInfo.ogImage },

    // twitter card
    { hid: 'twitter:title', name: 'twitter:title', content: defaultBrInfo.title },
    { hid: 'twitter:url', name: 'twitter:url', content: defaultBrInfo.url },
    { hid: 'twitter:description', name: 'twitter:description', content: defaultBrInfo.description },
    { hid: 'twitter:image', name: 'twitter:image', content: defaultBrInfo.ogImage },
  ],
  charset: 'utf-8',
  link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }],
};

const MUSIC_HEAD = {
  ...SCRIPTS,
  title: musicInfo.title,
  htmlAttrs: {
    lang: 'en' as LanguageOptions,
  },
  meta: [
    { name: 'description', content: musicInfo.description },

    { hid: 'og:title', property: 'og:title', content: musicInfo.title },
    { hid: 'og:url', property: 'og:url', content: musicInfo.url },
    { hid: 'og:description', property: 'og:description', content: musicInfo.description },
    { hid: 'og:image', property: 'og:image', content: musicInfo.ogImage },

    // twitter card
    { hid: 'twitter:title', name: 'twitter:title', content: musicInfo.title },
    { hid: 'twitter:url', name: 'twitter:url', content: musicInfo.url },
    { hid: 'twitter:description', name: 'twitter:description', content: musicInfo.description },
    { hid: 'twitter:image', name: 'twitter:image', content: musicInfo.ogImage },
  ],
  charset: 'utf-8',
  link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }],
};

const BR_MUSIC_HEAD = {
  ...SCRIPTS,
  title: musicBrInfo.title,
  htmlAttrs: {
    lang: 'pt-BR' as LanguageOptions,
  },
  meta: [
    { name: 'description', content: musicBrInfo.description },

    { hid: 'og:title', property: 'og:title', content: musicBrInfo.title },
    { hid: 'og:url', property: 'og:url', content: musicBrInfo.url },
    { hid: 'og:description', property: 'og:description', content: musicBrInfo.description },
    { hid: 'og:image', property: 'og:image', content: musicBrInfo.ogImage },

    // twitter card
    { hid: 'twitter:title', name: 'twitter:title', content: musicBrInfo.title },
    { hid: 'twitter:url', name: 'twitter:url', content: musicBrInfo.url },
    { hid: 'twitter:description', name: 'twitter:description', content: musicBrInfo.description },
    { hid: 'twitter:image', name: 'twitter:image', content: musicBrInfo.ogImage },
  ],
  charset: 'utf-8',
  link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }],
};

const DEFAULT_HEAD = {
  default: _DEFAULT_HEAD,
  music: MUSIC_HEAD,
};

const BR_HEAD = {
  default: _BR_HEAD,
  music: BR_MUSIC_HEAD,
};

export const ROUTES_HEAD_OPTIONS = ['music', 'default'] as const;
export type RoutesHeadOptions = (typeof ROUTES_HEAD_OPTIONS)[number];
type HeadOptions = {
  [key in LanguageOptions]: {
    [route in RoutesHeadOptions]: {
      htmlAttrs: {
        lang: LanguageOptions;
      };
      title: string;
      meta: { hid?: string; name?: string; property?: string; content: string }[];
      charset: string;
      link: { rel: string; href: string }[];
    };
  };
};

export const HEAD: HeadOptions = {
  en: DEFAULT_HEAD,
  'pt-BR': BR_HEAD,
};
