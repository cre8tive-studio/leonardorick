import type WaveSurfer from 'wavesurfer.js';

interface AudioStoreModel {
  waves: WaveSurfer[];
}

export const useAudioStore = defineStore('audioStore', () => {
  const state = reactive<AudioStoreModel>({
    waves: [],
  });

  function addWaveOnList(wave: WaveSurfer) {
    state.waves.push(wave);
  }

  return {
    addWaveOnList,
    ...toRefs(state),
  };
});
