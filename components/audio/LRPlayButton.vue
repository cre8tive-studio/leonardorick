<template>
  <button
    lr-cursor
    class="play-audio-button"
    :class="size"
    :disabled="disabled"
    @click="$emit('play', isPlaying ? 'pause' : 'play')"
  >
    <fa :icon="isPlaying ? 'pause' : 'play'" />
  </button>
</template>

<script setup lang="ts">
import type WaveSurfer from 'wavesurfer.js';
import type { AudioCardSizeOptions } from '~/types/audio-card-size.options';
import type { PlayOptions } from '~/types/play.options';

interface Props {
  wave: WaveSurfer | undefined;
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

useWhenReady(
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
  }
);
</script>

<style scoped lang="scss">
.play-audio-button {
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  transition: all 0.3s $default-ease;
  height: 70px;
  width: 70px;

  &.md {
    height: 45px;
    width: 45px;
    svg {
      height: 20px;
      width: 20px;
    }
  }

  svg {
    transition: color 0.3s $default-ease;
  }

  &:disabled {
    svg {
      color: $dark-text-4;
    }
  }

  &:not(:disabled) {
    cursor: none;

    &:hover {
      svg {
        color: $highlight;
      }

      &:active {
        svg {
          color: $highlight-3;
        }
      }
    }
  }
}

.play-audio-button svg {
  display: grid;
  place-items: center;
  font-size: 1.7rem;
  color: gray;
  pointer-events: none;
}

@media (max-width: $md-breakpoint) {
  .play-audio-buttons.md {
    height: 45px;
    width: 45px;
    svg {
      height: 20px;
      width: 20px;
    }
  }
}
</style>
