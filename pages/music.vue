<template>
  <div class="music-page">
    <ClientOnly>
      <h1 class="lr-text--body-3 mt-12 mb-12">{{ $t('song_page_featured_title') }}</h1>
      <LRAudioCardFeatured
        v-if="featuredRelease"
        class="featured"
        :audio="featuredRelease"
      />

      <h2 class="lr-text--body-2 mt-12 mb-6">{{ $t('song_page_original_songs_title') }}</h2>
      <div class="releases">
        <LRAudioCard
          v-for="release of remainingReleases"
          :key="release.id"
          :audio="release"
        />
      </div>

      <h2 class="lr-text--body-2 mt-12 mb-6">{{ $t('song_page_previews_title') }}</h2>
      <div>Comming later...</div>

      <div v-if="session">
        <div v-if="demosLoaded">
          <p>votes available: {{ upvotesAvailable }}</p>
          <div
            v-for="demo in demos"
            :key="demo.number"
            class="border border-gray-300 p-4 m-4"
          >
            <h2>{{ demo.title }}</h2>
            <p>votes: {{ upvotes[demo.number]?.length }}</p>
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
              v-if="demo.audioUrl"
              :id="demo.id"
              ref="demoRefs"
              :src="demo.audioUrl"
              controls
              @play="playAudio(demo.id)"
            />
            <div v-else-if="demosLoading">Loading demo player...</div>
            <div v-else>Unable to load demo player for this demo. Try again latter</div>
          </div>
        </div>
        <div v-else>Loading demos metadata...</div>
      </div>
    </ClientOnly>
  </div>
</template>
<script lang="ts" setup>
import type { DemoClientModel } from '../types/demo-client.model';
import type { UpvotesClientModel } from '../types/upvotes.model';
import { useAppStore } from '../store/index';
import { getExpireTime } from '../utils/js-utilities';

import type { AudioModel } from '~/types/audio.model';

const nuxtApp = useNuxtApp();

const { session } = toRefs(useAppStore());
const { settings, getJWT, getUpvotes, updateVotes } = useAppwrite();
const { request } = useRequest();

const demos = ref<DemoClientModel[]>([]);
const demoRefs = ref<HTMLAudioElement[]>([]);

const releases = ref<AudioModel[]>([]);
const featuredRelease = ref<AudioModel>();

const upvotes = ref<UpvotesClientModel>({});
const demosLoadedCount = ref(0);
const upvotesAvailable = ref(0);
const userId = ref('');

const demosLoading = computed(() => demosLoadedCount.value < demos.value.length);
const demosMaxVotes = computed(() => (settings.value ? demos.value.length * settings.value.upvotesMultiplier : 0));

const remainingReleases = computed(() => releases.value.filter((release) => !release.featured));
const demosLoaded = ref(false);

loadReleases();
setLoggedInformation();

function playAudio(audioId: string) {
  demoRefs.value.filter((ref) => ref.id !== audioId).forEach((audio) => audio.pause());
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

function demoVotes(demoNumber: number): string[] {
  return upvotes.value[demoNumber.toString()] || [];
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

async function loadReleases() {
  $fetch<AudioModel[]>('/api/getReleasesMetadata').then(async (data) => {
    releases.value = data;
    const featured = releases.value.find((release) => release.featured) as AudioModel;
    if (featured) {
      featuredRelease.value = featured;
    }
  });
}

async function setLoggedInformation() {
  if (session.value) {
    userId.value = session.value.userId;
    upvotes.value = await getUpvotes();

    request<DemoClientModel[]>('/api/getDemosMetadata', undefined, true).then(async ({ data }) => {
      demos.value = data.value;
      demosLoaded.value = true;
      setUpvotesAvailable();

      for (const demo of demos.value) {
        useFetch('/api/getDemoFile', {
          method: 'post',
          // unique key to ensure that data fetching can be properly de-duplicated and not cached wrongly
          key: demo.number.toString(),
          body: {
            number: demo.number,
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
        })
          .then(({ data: demoFile, error }) => {
            if (demoFile.value) {
              demo.audioUrl = URL.createObjectURL(demoFile.value.blob);
              demosLoadedCount.value += 1;
            }

            if (error.value) {
              demo.audioUrl = null;
              demosLoadedCount.value += 1;
            }
          })
          .catch(() => {
            demo.audioUrl = null;
            demosLoadedCount.value += 1;
          });
      }
    });
  }
}
</script>
<style lang="scss" scoped>
h1 {
  max-width: 1200px;
  text-align: center;
}

.music-page {
  padding-bottom: 64px;
}

.featured {
  margin: 0 auto;
}

.releases {
  display: flex;
}
</style>
