import { useLocalStorage } from '@vueuse/core';
import type WaveSurfer from 'wavesurfer.js';
import { useToasterStore } from './toaster';
import { useAppStore } from '.';
import type { UpvotesClientModel } from '~/types/upvotes.model';
import type { PremiumAudioModel } from '~/types/premium-audio.model';

interface AudioStoreModel {
  waves: WaveSurfer[];
  volume: number;
  upvotes: UpvotesClientModel;
  upvotesAvailable: number;
  covers: PremiumAudioModel[];
  playLocked: boolean;

  globalWaveformEl: HTMLElement | null;
  globalWave: WaveSurfer | null;
  lastPlayedWave: WaveSurfer | null;
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
    playLocked: false,

    globalWaveformEl: null,
    globalWave: null,
    lastPlayedWave: null,
  });

  const privateState = reactive<PrivateAudioStoreModel>({
    previews: [],
  });

  const { t: $t } = useI18n();
  const { fetchUpvotes, updateVotes } = useAppwrite();
  const { userId, settings, user } = toRefs(useAppStore());
  const toast = useToasterStore();

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

    fetchUpvotesAvailable();
  }

  function addWaveOnList(wave: WaveSurfer) {
    state.waves.push(wave);
  }

  function removeWaveFromList(wave: WaveSurfer) {
    const index = state.waves.indexOf(wave);
    if (index !== -1) {
      state.waves.splice(index, 1);
    }
  }

  async function removeVote(previewNumber: number) {
    await fetchUpvotesAvailable();
    if (isRemoveVoteDisabled(previewNumber)) {
      toast.warning({ text: $t('error.remove_vote') });
      return false;
    }

    const votes = getPreviewVotes(previewNumber);
    const index = votes.findIndex((voteId) => voteId === userId.value);
    votes.splice(index, 1);

    await updateLocalVotesRemotlyAndThenLocally(previewNumber, votes);
    return true;
  }

  async function addVote(previewNumber: number) {
    await fetchUpvotesAvailable();

    if (state.upvotesAvailable < 1) {
      toast.warning({ text: $t('error.add_vote') });
      return false;
    }
    const votes = getPreviewVotes(previewNumber);
    votes.push(userId.value);

    updateLocalVotesRemotlyAndThenLocally(previewNumber, votes); // not awaiting here so we can animate the heart in the template faster
    return true;
  }

  function setPreviewVotes(previewNumber: number, votes: string[]) {
    state.upvotes[previewNumber.toString()] = votes;
  }

  function getPreviewVotes(previewNumber: number): string[] {
    return state.upvotes[previewNumber.toString()] || [];
  }

  async function updateLocalVotesRemotlyAndThenLocally(previewNumber: number, votes: string[]) {
    await updateVotes(previewNumber, votes);
    setPreviewVotes(previewNumber, votes);
    setUpvotesAvailable();
  }

  async function fetchUpvotesAvailable() {
    state.upvotes = await fetchUpvotes();
    setUpvotesAvailable();
  }

  function setUpvotesAvailable() {
    state.upvotesAvailable = previewsMaxVotes.value;
    privateState.previews.forEach((preview) => {
      getPreviewVotes(preview.number).forEach((voteId) => {
        if (voteId === userId.value && state.upvotesAvailable > 0) {
          state.upvotesAvailable -= 1;
        }
      });
    });
  }

  function isRemoveVoteDisabled(number: number) {
    return state.upvotesAvailable === previewsMaxVotes.value || !state.upvotes[number]?.includes(userId.value);
  }

  function download(url: string, name: string) {
    const link = document.createElement('a');
    link.target = '_blank';
    link.download = name;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return {
    ...toRefs(state),
    previews,
    previewsMaxVotes,

    setPreviews,
    addWaveOnList,
    removeWaveFromList,
    addVote,
    removeVote,
    setUpvotesAvailable,
    isRemoveVoteDisabled,

    download,
  };
});
