import type { LanguageOptions } from '../constants/languages';

const path = import.meta.server ? process.env.VUE_APP_BASE_URL : window.location.host;

const defaultInfo = {
  title: 'Leonardo Rick - Software Engineer',
  description: 'Leonardo Rick Portfolio',
  url: 'https://leonardorick.com',
  ogImage: `${path}/meta/og-image.png`,
};

const musicInfo = {
  title: 'Leonardo Rick - Singer & Songwriter',
  description: 'Leonardo Rick Music Portifolio',
  url: 'https://leonardorick.com/music',
  ogImage: `${path}/meta/og-image-music.png`,
};

const defaultBrInfo = {
  title: 'Leonardo Rick - Engenheiro de Software',
  description: 'Portifólio de Leonardo Rick',
  url: 'https://leonardorick.com',
  ogImage: `${path}/meta/og-image.png`,
};

const musicBrInfo = {
  title: 'Leonardo Rick - Cantor e Compositor',
  description: 'Portifólio Musical de Leonardo Rick',
  url: 'https://leonardorick.com/music',
  ogImage: `${path}/meta/og-image-music.png`,
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
  chartset: 'utf-8',
  link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }],
};

const _BR_HEAD = {
  ...SCRIPTS,
  title: defaultBrInfo.title,
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
  chartset: 'utf-8',
  link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }],
};

const MUSIC_HEAD = {
  ...SCRIPTS,
  title: musicInfo.title,
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
  chartset: 'utf-8',
  link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }],
};

const BR_MUSIC_HEAD = {
  ...SCRIPTS,
  title: musicBrInfo.title,
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
  chartset: 'utf-8',
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
      title: string;
      meta: { hid?: string; name?: string; property?: string; content: string }[];
      chartset: string;
      link: { rel: string; href: string }[];
    };
  };
};

export const HEAD: HeadOptions = {
  en: DEFAULT_HEAD,
  'pt-BR': BR_HEAD,
};
