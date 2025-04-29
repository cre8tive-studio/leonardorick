<template>
  <div class="audio">
    <LRAudioCover
      :audio="audio"
      size="sm"
    />
    <div class="content">
      <div class="content__text">
        <h2 class="lr-text--body-1 mb-2">{{ audio.name }}</h2>
      </div>

      <LRWavePlayer
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

onUnmounted(() => {
  if (audioUrl.value) URL.revokeObjectURL(audioUrl.value);
});
</script>

<style scoped lang="scss">
.audio {
  height: 250px;
  padding-inline: 24px;
  background-color: $main-dark-bg;

  display: flex;
  gap: 24px;

  align-items: center;
  justify-content: center;

  box-shadow: $box-shadow-elevation-1;
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
@media (max-width: $lg-breakpoint) {
  .audio {
    height: 450px;
    flex-direction: column;
  }
}

@media (max-width: $sm-breakpoint) {
  .audio {
    height: 340px;
  }
}
</style>
