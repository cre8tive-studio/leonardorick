<template>
  <div class="media">
    <template v-if="loaded">
      <NuxtLink
        v-for="link of links"
        :key="link.link"
        :class="link.customClass"
        class="simple-action-button media-link"
        lr-cursor
        target="_blank"
        :to="link.link"
      >
        <component :is="link.svg" />
      </NuxtLink>
    </template>
    <div
      v-else
      class="loading-container"
    >
      <div
        v-for="index of size === 'lg' ? 4 : 2"
        :key="index"
      >
        <span class="base-loader" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AudioModel } from '~/types/audio.model';

import SvgoSpotify from '~/assets/icons/spotify.svg';
import SvgoAppleMusic from '~/assets/icons/apple-music.svg';
import SvgoYoutube from '~/assets/icons/youtube.svg';
import SvgoAmazonMusic from '~/assets/icons/amazon-music.svg';
import type { AudioCardSizeOptions } from '~/types/audio-card-size.options';

interface Props {
  audio?: AudioModel;
  size?: AudioCardSizeOptions;
}

interface MediaLink {
  svg: string;
  link: string;
  customClass?: string;
}

const { audio, size = 'sm' } = defineProps<Props>();
const loaded = ref(false);
const links: MediaLink[] = [];

useWhenReady(
  () => audio,
  () => {
    if (!audio) {
      loaded.value = true;
      return;
    }

    audio.spotify &&
      links.push({
        svg: SvgoSpotify,
        link: audio.spotify,
      });

    audio.appleMusic &&
      links.push({
        svg: SvgoAppleMusic,
        link: audio.appleMusic,
        customClass: 'apple-music',
      });

    if (size === 'lg') {
      audio.amazonMusic &&
        links.push({
          svg: SvgoAmazonMusic,
          link: audio.amazonMusic,
          customClass: 'amazon-music',
        });

      audio.youtube &&
        links.push({
          svg: SvgoYoutube,
          link: audio.youtube,
          customClass: 'youtube',
        });
    }

    loaded.value = true;
  }
);
</script>

<style scoped lang="scss">
.media {
  display: flex;
  gap: 4px;

  .media-link {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    width: 50px;

    &.apple-music {
      border-radius: 25%;
    }
    &.amazon-music {
      border-radius: 25%;

      svg {
        height: 85%;
        width: 85%;
      }
    }

    &.youtube svg {
      border-radius: 15%;
    }
    svg {
      height: 70%;
      width: 70%;
    }
  }

  .loading-container {
    display: flex;
    gap: 4px;
    div {
      height: 50px;
      width: 50px;
      span {
        border-radius: 25%;
        display: block;
        height: 75%;
        width: 75%;
      }
    }
  }
}
</style>
