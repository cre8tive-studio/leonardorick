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
import { useAppStore } from '../store/index';
import { getExpireTime } from '../utils/js-utilities';

const nuxtApp = useNuxtApp();
const { loaded } = toRefs(useAppStore());
const { settings, getCurrentSession, getJWT, getUpvotes, updateVotes } = useAppwrite();
const { request } = useRequest();
const songs = ref<DemoClientModel[]>([]);
const upvotes = ref<UpvotesClientModel>({});
const songsLoadedCount = ref(0);
const upvotesAvailable = ref(0);
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
        const { data: songFile, error } = await useFetch('/api/getSongFile', {
          method: 'post',
          body: {
            number: model.number,
          },
          headers: {
            Authorization: await getJWT(),
          },
          responseType: 'blob',
          transform(input: Blob) {
            // transform don't run on cached data so we can be sure that
            // this expire date iw always the last date that really
            // called the API, and can use this value inside getChachedData
            // to refresh the cahed song file
            return {
              blob: input,
              expire: getExpireTime(),
            };
          },
          getCachedData(key: string) {
            // documented way to access cached data:
            // https://github.com/nuxt/nuxt/issues/15445#issuecomment-1779361265
            const cached = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
            if (!cached) {
              return null;
            }

            if (isNotExpired(cached.expire)) {
              return cached;
            }
            // if you return nullish here --> refetch data
            // if you return anything here, this will be used as the value
            // reaching here is like returning undefined
          },
        });

        if (error.value) {
          model.songUrl = null;
          songsLoadedCount.value += 1;
        }

        if (songFile.value) {
          model.songUrl = URL.createObjectURL(songFile.value.blob);
          songsLoadedCount.value += 1;
        }
      });
    });
  }
}
</script>
<style lang="scss"></style>
