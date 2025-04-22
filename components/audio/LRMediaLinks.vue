<template>
  <div class="media">
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
  </div>
</template>

<script setup lang="ts">
import type { AudioModel } from '~/types/audio.model';

import SvgoSpotify from '~/assets/icons/spotify.svg';
import SvgoAppleMusic from '~/assets/icons/apple-music.svg';

interface Props {
  audio: AudioModel;
}

interface MediaLink {
  svg: string;
  link: string;
  customClass?: string;
}

const { audio } = defineProps<Props>();
const links: MediaLink[] = [];

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

    svg {
      height: 70%;
      width: 70%;
    }
  }
}
</style>
