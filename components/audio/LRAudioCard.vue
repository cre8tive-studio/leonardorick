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
        v-if="mounted"
        :audio-blob="audioBlob"
        :audio="audio"
        size="md"
        :eager="eager"
        @play="handlePlay"
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

const audioBlob = ref<Blob>();

const { getCachedFile, getCachedFileFromCache } = useCachedFile();

const eager = ref(true);
const mounted = ref(false); // so we can pass the right eager value to wave player mounting it only after knowing it.

onMounted(async () => {
  const blob = await getCachedFileFromCache(audio.fileId);
  if (blob) {
    eager.value = true;
    audioBlob.value = blob;
  } else {
    eager.value = false;
  }
  mounted.value = true;
});

async function handlePlay($event: PlayOptions) {
  if ($event === 'play' && !audioBlob.value) {
    eager.value = true;
    await requestAudioFile();
  }
}

async function requestAudioFile() {
  const blob = await getCachedFile({ fileId: audio.fileId, method: 'post' });
  audioBlob.value = blob;
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
