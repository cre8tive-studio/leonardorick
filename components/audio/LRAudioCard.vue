<template>
  <div class="audio">
    <LRAudioCover
      :audio="audio"
      show-image-overlay
      size="md"
    />
    <div class="content">
      <div class="content__text">
        <h2 class="lr-text--body-1 mb-2">{{ audio.title }}</h2>
      </div>

      <LRWavePlayer
        :audio-url="audioUrl"
        size="md"
        :eager="eager"
        @play="play"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import LRAudioCover from './LRAudioCover.vue';
import type { PlayOptions } from '~/types/play.options';
import type { AudioModel } from '~/types/audio.model';

interface Props {
  audio: AudioModel;
}

const { audio } = defineProps<Props>();

const audioUrl = ref('');

const { getCachedFile, getCachedFileFromCache } = useCachedFile();
const loaded = ref(false);
const eager = ref(false);

onMounted(async () => {
  const data = await getCachedFileFromCache(audio.fileId);
  if (data) {
    loaded.value = true;
    audioUrl.value = URL.createObjectURL(data);
  }
});

onUnmounted(() => {
  if (audioUrl.value) URL.revokeObjectURL(audioUrl.value);
});

function play($event: PlayOptions) {
  if ($event === 'play' && !loaded.value) {
    loaded.value = true;
    eager.value = true;
    requestAudioFile();
  }
}

function requestAudioFile() {
  getCachedFile({ fileId: audio.fileId, method: 'post' }).then((blob) => {
    if (blob) {
      audioUrl.value = URL.createObjectURL(blob);
    }
  });
}
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
