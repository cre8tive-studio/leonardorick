<template>
  <div class="audio">
    <LRAudioCover
      :audio="audio"
      size="md"
    />
    <div class="content">
      <div class="content__text">
        <h2 class="lr-text--body-1 mb-2">{{ audio.title }}</h2>
      </div>

      <LRWavePlayer
        :audio-url="audioUrl"
        size="md"
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

const { getCachedFile } = useCachedFile();

getCachedFile({ fileId: audio.fileId, method: 'post' }).then((blob) => {
  if (blob) {
    audioUrl.value = URL.createObjectURL(blob);
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
    flex: 1;
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

    .content {
      flex: inherit;
      width: 100%;
    }
  }
}

@media (max-width: $sm-breakpoint) {
  .audio {
    height: 370px;
  }
}
</style>
