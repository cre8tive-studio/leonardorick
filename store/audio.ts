import { useLocalStorage } from '@vueuse/core';
import type WaveSurfer from 'wavesurfer.js';

interface AudioStoreModel {
  waves: WaveSurfer[];
  volume: number;
}

export const useAudioStore = defineStore('audioStore', () => {
  const state = reactive<AudioStoreModel>({
    waves: [],
    volume: -1, // ignored as hydrate runs
  });

  onMounted(() => {
    if (import.meta.client) {
      state.volume = useLocalStorage('volume', 1).value;
    }
  });

  function addWaveOnList(wave: WaveSurfer) {
    state.waves.push(wave);
  }

  return {
    addWaveOnList,
    ...toRefs(state),
  };
});
