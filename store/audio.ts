import { useLocalStorage } from '@vueuse/core';
import type WaveSurfer from 'wavesurfer.js';
import { useAppStore } from '.';
import type { UpvotesClientModel } from '~/types/upvotes.model';
import type { DemoClientModel } from '~/types/demo-client.model';

interface AudioStoreModel {
  waves: WaveSurfer[];
  volume: number;
  upvotes: UpvotesClientModel;
  upvotesAvailable: number;
}

interface PrivateAudioStoreModel {
  demos: DemoClientModel[];
}

export const useAudioStore = defineStore('audioStore', () => {
  const state = reactive<AudioStoreModel>({
    waves: [],
    volume: -1, // ignored as hydrate runs and onMounted overwrite
    upvotes: {},
    upvotesAvailable: 0,
  });

  const privateState = reactive<PrivateAudioStoreModel>({
    demos: [],
  });

  const { getUpvotes, updateVotes } = useAppwrite();
  const { userId, settings } = toRefs(useAppStore());

  const demosMaxVotes = computed(() =>
    settings.value ? Math.round(privateState.demos.length * settings.value.upvotesMultiplier) : 0
  );

  const demos = computed(() => privateState.demos);

  onMounted(() => {
    if (import.meta.client) {
      state.volume = useLocalStorage('volume', 0.5).value;
    }
  });

  function setDemos(newDemos: DemoClientModel[]) {
    privateState.demos = newDemos;
    updateVotesCallback();
  }

  function addWaveOnList(wave: WaveSurfer) {
    state.waves.push(wave);
  }

  function removeVote(demoNumber: number) {
    const votes = demoVotes(demoNumber);
    const index = votes.findIndex((voteId) => voteId === userId.value);
    votes.splice(index, 1);
    setUpvotesAvailable();
    updateVotes(demoNumber, votes).then(updateVotesCallback);
  }

  function addVote(demoNumber: number) {
    const votes = demoVotes(demoNumber);
    votes.push(userId.value);
    setUpvotesAvailable();
    updateVotes(demoNumber, votes).then(updateVotesCallback);
  }

  function demoVotes(demoNumber: number): string[] {
    return state.upvotes[demoNumber.toString()] || [];
  }

  async function updateVotesCallback() {
    state.upvotes = await getUpvotes();
    setUpvotesAvailable();
  }

  function setUpvotesAvailable() {
    state.upvotesAvailable = demosMaxVotes.value;
    privateState.demos.forEach((demo) => {
      demoVotes(demo.number).forEach((voteId) => {
        if (voteId === userId.value && state.upvotesAvailable > 0) {
          state.upvotesAvailable -= 1;
        }
      });
    });
  }

  return {
    ...toRefs(state),
    demos,
    demosMaxVotes,

    setDemos,
    addWaveOnList,
    addVote,
    removeVote,
    setUpvotesAvailable,
  };
});
