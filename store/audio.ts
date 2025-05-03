import { useLocalStorage } from '@vueuse/core';
import type WaveSurfer from 'wavesurfer.js';
import { useAppStore } from '.';
import type { UpvotesClientModel } from '~/types/upvotes.model';
import type { PreviewClientModel } from '~/types/preview.model';

interface AudioStoreModel {
  waves: WaveSurfer[];
  volume: number;
  upvotes: UpvotesClientModel;
  upvotesAvailable: number;
}

interface PrivateAudioStoreModel {
  previews: PreviewClientModel[];
}

export const useAudioStore = defineStore('audioStore', () => {
  const state = reactive<AudioStoreModel>({
    waves: [],
    volume: -1, // ignored as hydrate runs and onMounted overwrite
    upvotes: {},
    upvotesAvailable: 0,
  });

  const privateState = reactive<PrivateAudioStoreModel>({
    previews: [],
  });

  const { getUpvotes, updateVotes } = useAppwrite();
  const { userId, settings } = toRefs(useAppStore());

  const previewsMaxVotes = computed(() =>
    settings.value ? Math.round(privateState.previews.length * settings.value.upvotesMultiplier) : 0
  );

  const previews = computed(() => privateState.previews);

  onMounted(() => {
    if (import.meta.client) {
      state.volume = useLocalStorage('volume', 0.5).value;
    }
  });

  function setPreviews(newPreviews: PreviewClientModel[]) {
    privateState.previews = newPreviews;
    updateVotesCallback();
  }

  function addWaveOnList(wave: WaveSurfer) {
    state.waves.push(wave);
  }

  function removeVote(previewNumber: number) {
    const votes = previewVotes(previewNumber);
    const index = votes.findIndex((voteId) => voteId === userId.value);
    votes.splice(index, 1);
    setUpvotesAvailable();
    updateVotes(previewNumber, votes).then(updateVotesCallback);
  }

  function addVote(previewNumber: number) {
    const votes = previewVotes(previewNumber);
    votes.push(userId.value);
    setUpvotesAvailable();
    updateVotes(previewNumber, votes).then(updateVotesCallback);
  }

  function previewVotes(previewNumber: number): string[] {
    return state.upvotes[previewNumber.toString()] || [];
  }

  async function updateVotesCallback() {
    state.upvotes = await getUpvotes();
    setUpvotesAvailable();
  }

  function setUpvotesAvailable() {
    state.upvotesAvailable = previewsMaxVotes.value;
    privateState.previews.forEach((preview) => {
      previewVotes(preview.number).forEach((voteId) => {
        if (voteId === userId.value && state.upvotesAvailable > 0) {
          state.upvotesAvailable -= 1;
        }
      });
    });
  }

  return {
    ...toRefs(state),
    previews,
    previewsMaxVotes,

    setPreviews,
    addWaveOnList,
    addVote,
    removeVote,
    setUpvotesAvailable,
  };
});
