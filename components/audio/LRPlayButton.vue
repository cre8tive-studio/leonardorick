<template>
  <button
    lr-cursor
    class="simple-action-button colorful-actions play-audio-button"
    :class="size"
    :disabled="disabled"
    @click="$emit('play', isPlaying ? 'pause' : 'play')"
  >
    <fa :icon="isPlaying ? 'pause' : 'play'" />
  </button>
</template>

<script setup lang="ts">
import type { AudioCardSizeOptions } from '~/types/audio-card-size.options';
import type { PlayOptions } from '~/types/play.options';
import type { WaveSurferWithIdModel } from '~/types/wavesurfer-with-id.model';

interface Props {
  wave: WaveSurferWithIdModel | undefined;
  size: AudioCardSizeOptions;
  enabled?: boolean;
}
interface Emits {
  (e: 'play', value: PlayOptions): void;
}
const { wave, enabled = true } = defineProps<Props>();
defineEmits<Emits>();

const isPlaying = ref(false);

const disabled = computed(() => !enabled);

watch(
  () => wave,
  () => {
    if (!wave) return;

    isPlaying.value = wave.isPlaying();

    wave.on('play', () => {
      isPlaying.value = true;
    });
    wave.on('pause', () => {
      isPlaying.value = false;
    });
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.play-audio-button {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 70px;
  width: 70px;

  svg {
    height: 27px;
    width: 27px;
  }
}

@media (max-width: $lg-breakpoint) {
  .play-audio-button.md {
    height: 45px;
    width: 45px;
    svg {
      height: 20px;
      width: 20px;
    }
  }
}
</style>
