<template>
  <div class="audio">
    <LRAudioCover
      :audio="audio"
      size="sm"
    />
    <div class="content">
      <div class="content__text">
        <h2 class="">{{ audio.name }}</h2>
        <h3
          v-if="audio.featured"
          class="lr-text--body-1"
        >
          {{ $t('song_page_featured_description') }}
        </h3>
      </div>

      <LRWavePlayer
        v-if="audioUrl"
        :audio-url="audioUrl"
        size="sm"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import LRAudioCover from './LRAudioCover.vue';
import type { AudioModel } from '~/types/audio.model';

interface Props {
  audio: AudioModel;
}

const { audio } = defineProps<Props>();

const audioUrl = ref('');

useCachedFile({ fileId: audio.fileId }).then(({ data: audioFile }) => {
  if (audioFile.value) {
    audioUrl.value = URL.createObjectURL(audioFile.value.blob);
  }
});
</script>

<style scoped lang="scss">
.audio {
  --box-shadow06: 6px 6px 12px #060607, -3px -3px 12px #17181a, inset 3px 3px 8px #202024, inset -4px -4px 8px #151618;

  height: 250px;
  width: fit-content;
  padding-inline: 24px;
  background-color: $main-dark-bg;

  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: center;

  box-shadow: var(--box-shadow06);
  border-radius: 7px;
  transition: opacity 0.3s $default-ease;

  .content {
    display: flex;
    flex-direction: column;

    h2 {
      text-align: left;
    }
  }
}
</style>
