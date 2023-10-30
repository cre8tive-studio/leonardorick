<template>
  <h1>{{ $t('music_page') }}</h1>
  <ClientOnly>
    <div v-if="loaded">
      <p>votes available: {{ upvotesAvailable }}</p>
      <div
        v-for="(demo, demoIndex) in demos"
        :key="demo.number"
        class="border border-gray-300 p-4 m-4"
      >
        <h2>{{ demo.title }}</h2>
        <p>votes: {{ upvotes[demo.number].length }}</p>
        <div class="flex gap-4">
          <button
            :disabled="upvotesAvailable < 1"
            class="bg-neutral-400 [&:not(:disabled)]:hover:bg-neutral-500 p-2 disabled:cursor-not-allowed"
            @click="addVote(demo.number)"
          >
            vote
          </button>

          <button
            :disabled="upvotesAvailable === demosMaxVotes"
            class="bg-neutral-400 [&:not(:disabled)]:hover:bg-neutral-500 p-2 disabled:cursor-not-allowed"
            @click="removeVote(demo.number)"
          >
            remove vote
          </button>
        </div>
        <audio
          v-if="demo.demoUrl"
          ref="demoAudioRefs"
          :src="demo.demoUrl"
          controls
          @play="playAudio(demoIndex)"
        ></audio>
        <div v-else-if="filesLoading">Loading demo player...</div>
        <div v-else>Unable to load demo player for this demo. Try again latter</div>
      </div>
    </div>
    <div v-else>Loading demos metadata...</div>
  </ClientOnly>
</template>
<script lang="ts" setup>
import type { DemoClientModel } from '../types/demo-client.model';
import type { UpvotesClientModel } from '../types/upvotes.model';
import { useAppStore } from '../store/index';
import { getExpireTime } from '../utils/js-utilities';
import { MUSIC_HEAD } from '../utils/analytics/head';

const nuxtApp = useNuxtApp();
const { loaded } = toRefs(useAppStore());
const { settings, getCurrentSession, getJWT, getUpvotes, updateVotes } = useAppwrite();
const { request } = useRequest();
const demos = ref<DemoClientModel[]>([]);
const demoAudioRefs = ref<HTMLAudioElement[]>([]);
const upvotes = ref<UpvotesClientModel>({});
const demosLoadedCount = ref(0);
const upvotesAvailable = ref(0);
const userId = ref('');

const filesLoading = computed(() => demosLoadedCount.value < demos.value.length);
const demosMaxVotes = computed(() =>
  settings.value ? demos.value.length * settings.value.upvotesMultiplier : 0
);

useHead(MUSIC_HEAD);

setLoggedInformation();

function playAudio(index: number) {
  demoAudioRefs.value.forEach((audio, i) => {
    if (index !== i) {
      audio.pause();
    }
  });
}

function setUpvotesAvailable() {
  upvotesAvailable.value = demosMaxVotes.value;
  demos.value.forEach((demo) => {
    demoVotes(demo.number).forEach((voteId) => {
      if (voteId === userId.value && upvotesAvailable.value > 0) {
        upvotesAvailable.value -= 1;
      }
    });
  });
}

function demoVotes(demoNumber: number) {
  return upvotes.value[demoNumber.toString()];
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

async function updateVotesCallback() {
  upvotes.value = await getUpvotes();
  setUpvotesAvailable();
}

async function setLoggedInformation() {
  const session = await getCurrentSession();
  if (session) {
    userId.value = session.userId;
    upvotes.value = await getUpvotes();

    request<DemoClientModel[]>('/api/getDemosMetadata', undefined, true).then(({ data }) => {
      demos.value = data.value;
      loaded.value = true;
      setUpvotesAvailable();

      demos.value.forEach(async (model) => {
        const { data: demoFile, error } = await useFetch(`/api/getDemoFile/${model.number}`, {
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
            // to refresh the cahed demo file
            return {
              blob: input,
              expire: getExpireTime(60),
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
          model.demoUrl = null;
          demosLoadedCount.value += 1;
        }

        if (demoFile.value) {
          model.demoUrl = URL.createObjectURL(demoFile.value.blob);
          demosLoadedCount.value += 1;
        }
      });
    });
  }
}
</script>
<style lang="scss"></style>
