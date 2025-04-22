<template>
  <button
    lr-cursor
    class="play-audio-button"
    @click="$emit('play')"
  >
    <fa
      v-if="isPlaying"
      icon="pause"
    />
    <fa
      v-else
      icon="play"
    />
  </button>
</template>

<script setup lang="ts">
import type WaveSurfer from 'wavesurfer.js';

interface Props {
  wave: WaveSurfer;
}
interface Emits {
  (e: 'play'): void;
}
const { wave } = defineProps<Props>();
defineEmits<Emits>();
const isPlaying = ref(wave.isPlaying());

wave.on('play', () => {
  isPlaying.value = true;
});
wave.on('pause', () => {
  isPlaying.value = false;
});
</script>

<style scoped lang="scss">
.play-audio-button {
  display: grid;
  place-items: center;
  cursor: none;
  border-radius: 50%;
  transition: all 0.3s $default-ease;
  height: 70px;
  width: 70px;
}

.play-audio-button:hover svg {
  color: $highlight;
}

.play-audio-button svg {
  display: grid;
  place-items: center;
  font-size: 1.7rem;
  color: gray;
  pointer-events: none;
}
</style>
