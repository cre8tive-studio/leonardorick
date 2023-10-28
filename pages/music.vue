<template>
  <h1>{{ $t('music_page') }}</h1>
  <ClientOnly>
    <div v-if="loaded">
      <p>votes available: {{ upvotesAvailable }}</p>
      <div
        v-for="song in songs"
        :key="song.number"
        class="border border-gray-300 p-4 m-4"
      >
        <h2>{{ song.title }}</h2>
        <p>votes: {{ upvotes[song.number].length }}</p>
        <div class="flex gap-4">
          <button
            :disabled="upvotesAvailable < 1"
            class="bg-neutral-400 [&:not(:disabled)]:hover:bg-neutral-500 p-2 disabled:cursor-not-allowed"
            @click="addVote(song.number)"
          >
            vote
          </button>

          <button
            :disabled="upvotesAvailable === songsMaxVotes"
            class="bg-neutral-400 [&:not(:disabled)]:hover:bg-neutral-500 p-2 disabled:cursor-not-allowed"
            @click="removeVote(song.number)"
          >
            remove vote
          </button>
        </div>
        <audio
          v-if="song.songUrl"
          :src="song.songUrl"
          controls
        ></audio>
        <div v-else-if="filesLoading">Loading song player...</div>
        <div v-else>Unable to load song player for this song. Try again latter</div>
      </div>
    </div>
    <div v-else>Loading songs metadata...</div>
  </ClientOnly>
</template>
<script lang="ts" setup>
import type { DemoClientModel } from '../types/demo-client.model';
import type { UpvotesClientModel } from '../types/upvotes.model';

const { settings, getCurrentSession, getJWT, getUpvotes, updateVotes } = useAppwrite();
const { request } = useRequest();
const songs = ref<DemoClientModel[]>([]);
const upvotes = ref<UpvotesClientModel>({});
const songsLoadedCount = ref(0);
const upvotesAvailable = ref(0);
const loaded = ref(false);
const userId = ref('');

const filesLoading = computed(() => songsLoadedCount.value < songs.value.length);
const songsMaxVotes = computed(() =>
  settings.value ? songs.value.length * settings.value.upvotesMultiplier : 0
);

setLoggedInformation();

function setUpvotesAvailable() {
  upvotesAvailable.value = songsMaxVotes.value;
  songs.value.forEach((song) => {
    songVotes(song.number).forEach((voteId) => {
      if (voteId === userId.value && upvotesAvailable.value > 0) {
        upvotesAvailable.value -= 1;
      }
    });
  });
}

function songVotes(songNumber: number) {
  return upvotes.value[songNumber.toString()];
}

function removeVote(songNumber: number) {
  const votes = songVotes(songNumber);
  const index = votes.findIndex((voteId) => voteId === userId.value);
  votes.splice(index, 1);
  setUpvotesAvailable();
  updateVotes(songNumber, votes).then(updateVotesCallback);
}

function addVote(songNumber: number) {
  const votes = songVotes(songNumber);
  votes.push(userId.value);
  setUpvotesAvailable();
  updateVotes(songNumber, votes).then(updateVotesCallback);
}

async function updateVotesCallback() {
  upvotes.value = await getUpvotes();
  setUpvotesAvailable();
}

async function setLoggedInformation() {
  const session = await getCurrentSession();
  if (session) {
    userId.value = session.userId;
    upvotes.value = await getUpvotes();

    request<DemoClientModel[]>('/api/getSongsMetadata').then(({ data }) => {
      songs.value = data.value;
      loaded.value = true;
      setUpvotesAvailable();
      songs.value.forEach(async (model) => {
        const { error } = await useFetch('/api/getSongFile', {
          method: 'post',
          body: {
            number: model.number,
          },
          headers: {
            Authorization: await getJWT(),
          },
          responseType: 'blob',
          onResponse({ response }) {
            const url = URL.createObjectURL(response._data);
            model.songUrl = url;
            songsLoadedCount.value += 1;
          },
          onResponseError() {
            model.songUrl = null;
          },
        });

        // sometime the request is cached and just return the error. In this case
        // we don't pass through the interceptors and need to handle the error here
        if (error.value) {
          model.songUrl = null;
          songsLoadedCount.value += 1;
        }
      });
    });
  }
}
</script>
<style lang="scss"></style>
