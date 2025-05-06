import { useLocalStorage } from '@vueuse/core';
import type WaveSurfer from 'wavesurfer.js';
import { useAppStore } from '.';
import type { UpvotesClientModel } from '~/types/upvotes.model';
import type { PremiumAudioModel } from '~/types/premium-audio.model';

interface AudioStoreModel {
  waves: WaveSurfer[];
  volume: number;
  upvotes: UpvotesClientModel;
  upvotesAvailable: number;
  covers: PremiumAudioModel[];
}

interface PrivateAudioStoreModel {
  previews: PremiumAudioModel[];
}

export const useAudioStore = defineStore('audioStore', () => {
  const state = reactive<AudioStoreModel>({
    waves: [],
    volume: -1, // ignored as hydrate runs and onMounted overwrite
    upvotes: {},
    covers: [],
    upvotesAvailable: 0,
  });

  const privateState = reactive<PrivateAudioStoreModel>({
    previews: [],
  });

  const { getUpvotes, updateVotes } = useAppwrite();
  const { userId, settings, user } = toRefs(useAppStore());

  const previewsMaxVotes = computed(() =>
    settings.value ? Math.round(privateState.previews.length * settings.value.upvotesMultiplier) : 0
  );

  const previews = computed(() => privateState.previews);

  onMounted(() => {
    if (import.meta.client) {
      state.volume = useLocalStorage('volume', 0.5).value;
    }
  });

  function setPreviews(newPreviews: PremiumAudioModel[]) {
    if (user.value?.featuredPreviews) {
      for (const preview of newPreviews) {
        if (user.value.featuredPreviews.includes(preview.number)) {
          preview.featured = true;
        }
      }
    }

    privateState.previews = newPreviews
      .sort((a, b) => b.number - a.number)
      .sort((a, b) => Number(b.enabled) - Number(a.enabled));
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
