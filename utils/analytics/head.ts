// todo think about a better approach to deal with meta tags and page titles
const isClient = process.client;
const path = isClient ? window.location.origin : process.env.VUE_APP_BASE_URL;

const defaultInfo = {
  title: 'Leonardo Rick - Software Engineer',

  description: 'Leonardo Rick Portfolio',
  url: 'https://leonardorick.com',
  ogImage: `${path}/og-image.png`,
};

const musicInfo = {
  ...defaultInfo,
  url: 'https://leonardorick.com/music',
  ogImage: `${path}/og-image-music.png`,
};

export const DEFAULT_HEAD = {
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
  link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' }],
  chartset: 'utf-8',
};

export const MUSIC_HEAD = {
  ...DEFAULT_HEAD,
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
};
