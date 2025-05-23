<template>
  <div
    ref="selfEl"
    class="audio"
  >
    <LRAudioCover :audio="audio" />

    <div class="content">
      <div
        v-if="audio?.title"
        class="content__text"
      >
        <h2 class="">{{ audio.title }}</h2>
        <h3 class="lr-text--body-1 mb-2">
          {{ $t('song_page_featured_description') }}
        </h3>
      </div>
      <div
        v-else
        class="text-loader"
      >
        <div class="skeleton title"></div>
        <div class="skeleton subtitle mb-2"></div>
      </div>

      <LRWavePlayer
        :audio-blob="audioBlob"
        :audio="audio"
        @audioprocess="rotateBackground"
      />
      <LRMediaLinks
        size="lg"
        :audio="audio"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import LRMediaLinks from './LRMediaLinks.vue';
import LRWavePlayer from './LRWavePlayer.vue';
import type { AudioModel } from '~/types/audio.model';

interface Props {
  audio: AudioModel | undefined;
}

const { audio } = defineProps<Props>();

const { getCachedFile } = useCachedFile();

const audioBlob = ref<Blob>();

const selfEl = ref<HTMLDivElement>();

function rotateBackground(currentTime: number) {
  selfEl.value?.style.setProperty('--background-rotation', `${30 + currentTime * 10}deg`);
}

useWhenReady(
  () => audio,
  () => {
    if (!audio) return;
    getCachedFile({ fileId: audio.fileId, method: 'post' }).then((blob) => {
      if (blob) {
        audioBlob.value = blob;
      }
    });
  }
);
</script>

<style scoped lang="scss">
.audio {
  --background-rotation: 0;

  width: fit-content;
  overflow-x: hidden; //because of ::before background it exceeds the page width

  position: relative;
  flex-direction: column;

  display: flex;
  gap: 48px;
  padding-inline: 32px;
  align-items: center;
  justify-content: center;

  overflow: hidden;
  box-shadow: $box-shadow-elevation-1;
  border-radius: 7px;
  transition: opacity 0.3s $default-ease;

  .content {
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-width: 260px;

    h2 {
      text-align: left;
      @extend .lr-text--body-2;
    }
  }

  &::before {
    content: '';
    background: url(/images/disco_bg_2.png);
    position: absolute;
    width: 172%;
    z-index: -1;
    aspect-ratio: 1 / 1;
    left: -62%;
    background-size: 99% auto; /* Scale only the width */

    background-position: center;
    transform-origin: center;
    transform: rotate(var(--background-rotation, 0));
    pointer-events: none;
  }
}

@media (min-width: $xxxl-breakpoint) {
  .audio {
    padding-inline: 82px;
  }
}

@media (min-width: $xl-breakpoint) {
  .audio {
    min-height: 75vh;
    flex-direction: row;

    .content {
      min-width: 550px;
    }

    :deep(.media) {
      position: relative;
      left: -8px;
    }
  }
}

@media (max-width: $sm-breakpoint) {
  .audio {
    gap: 16px;
    padding-inline: 32px;
    margin-inline: 0;
    .content {
      gap: 8px;
    }
  }
}

@media (max-width: $xl-breakpoint) {
  .audio {
    padding-block: 24px;
    .content {
      width: 100%;
    }

    &::before {
      left: -60%;
      background-size: 122% auto;
      width: 271%;
      left: -84%;
      top: -33%;
    }
  }
}
</style>
