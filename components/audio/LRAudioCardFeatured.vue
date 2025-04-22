<template>
  <div
    ref="selfEl"
    class="audio"
  >
    <LRAudioCover :audio="audio" />

    <div class="content">
      <div class="content__text">
        <h2 class="">{{ audio.name }}</h2>
        <h3 class="lr-text--body-1">
          {{ $t('song_page_featured_description') }}
        </h3>
      </div>

      <LRWavePlayer
        v-if="audioUrl"
        :audio-url="audioUrl"
        @audioprocess="rotateBackground"
      />
      <LRMediaLinks :audio="audio" />
    </div>
  </div>
</template>

<script setup lang="ts">
import LRMediaLinks from './LRMediaLinks.vue';
import LRWavePlayer from './LRWavePlayer.vue';
import type { AudioModel } from '~/types/audio.model';

interface Props {
  audio: AudioModel;
}

const { audio } = defineProps<Props>();

const audioUrl = ref('');

const selfEl = ref<HTMLDivElement>();

function rotateBackground(currentTime: number) {
  selfEl.value?.style.setProperty('--background-rotation', `${30 + currentTime * 10}deg`);
}

useCachedFile({ fileId: audio.fileId }).then(({ data: audioFile }) => {
  if (audioFile.value) {
    audioUrl.value = URL.createObjectURL(audioFile.value.blob);
  }
});
</script>

<style scoped lang="scss">
.audio {
  --box-shadow06: 6px 6px 12px #060607, -3px -3px 12px #17181a, inset 3px 3px 8px #202024, inset -4px -4px 8px #151618;
  --background-rotation: 0;

  height: 400px;
  width: fit-content;
  position: relative;

  display: flex;
  gap: 48px;
  padding-inline: 48px;
  align-items: center;
  justify-content: center;

  overflow: hidden;
  box-shadow: var(--box-shadow06);
  border-radius: 7px;
  transition: opacity 0.3s $default-ease;

  .content {
    display: flex;
    flex-direction: column;
    gap: 24px;

    h2 {
      text-align: left;
      @extend .lr-text--body-2;
    }
  }

  &::before {
    content: '';
    background: url(~/assets/images/disco_bg_2.png);
    position: absolute;
    width: 160%;
    z-index: -1;
    aspect-ratio: 1 / 1;
    left: -57%;
    background-size: 111% auto; /* Scale only the width */

    background-position: center;
    transform-origin: center;
    transform: rotate(var(--background-rotation, 0));
    pointer-events: none;
  }

  :deep(.media) {
    position: relative;
    left: -8px;
  }
}
</style>
