<template>
  <div class="music-page lr-section-page-paddings">
    <ClientOnly>
      <h1 class="lr-text--body-3 mt-12 mb-12 mx-auto">{{ $t('song_page_featured_title') }}</h1>
      <LRAudioCardFeatured
        class="featured"
        :audio="featuredRelease"
      />

      <h2 class="lr-text--body-2 m-6 mt-12 mb-6">{{ $t('song_page_original_songs_title') }}</h2>

      <div class="audio-list mb-24">
        <LRAudioCard
          v-for="release of remainingReleases"
          :key="release.id"
          :audio="release"
        />
      </div>
      <div class="divider height-1"></div>
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
      <div
        v-else
        class="previews-blocked"
      >
        <h2 class="lr-text--body-2">{{ $t('song_page_previews_title') }}</h2>
        <div class="content">
          <SvgoLock />
          <h3 class="lr-text--body-1">{{ $t('exclusive_access_for_supporters') }}</h3>
          <div class="flex gap-6">
            <button
              lr-cursor
              class="lr-button"
              @click="shouldShowModal = true"
            >
              {{ $t('join_supporters') }}
            </button>
            <NuxtLink
              lr-cursor
              class="lr-button lr-button-secondary"
              :to="localeRoute('login')"
            >
              {{ $t('login') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </ClientOnly>
    <LRHowItWorksModal
      :should-show-modal="shouldShowModal"
      @close="shouldShowModal = false"
    />
  </div>
</template>
<script lang="ts" setup>
import type { DemoClientModel } from '../types/demo-client.model';
import type { UpvotesClientModel } from '../types/upvotes.model';
import { useAppStore } from '../store/index';
import { getExpireTime } from '../utils/js-utilities';

import type { AudioModel } from '~/types/audio.model';
import LRHowItWorksModal from '~/components/modal/LRHowItWorksModal.vue';

const nuxtApp = useNuxtApp();

const { localeRoute, session } = toRefs(useAppStore());
const { settings, getJWT, getUpvotes, updateVotes, getReleasesMetadata } = useAppwrite();
const { request } = useRequest();

const demos = ref<DemoClientModel[]>([]);
const demoRefs = ref<HTMLAudioElement[]>([]);

const releases = ref<AudioModel[]>([]);
const featuredRelease = ref<AudioModel>();

const upvotes = ref<UpvotesClientModel>({});
const demosLoadedCount = ref(0);
const upvotesAvailable = ref(0);
const userId = ref('');
const shouldShowModal = ref(false);

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
  getReleasesMetadata().then(async (data) => {
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
      if (!data.value) {
        demosLoaded.value = true;
        return;
      }

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
  text-align: left;
  max-width: 1200px;
  text-align: center;
  margin-block: 24px;
  margin-bottom: 48px;
}

.music-page {
  padding-bottom: 64px;
}

.featured {
  margin: 0 auto;
  margin-bottom: 48px;
}

.audio-list {
  display: grid;
  grid-template-columns: min-content;
  justify-content: center;
  gap: 16px;
  margin-inline: 16px;
}

.divider {
  background-color: $main-dark-text;
  height: 2px;
  border-radius: 1px;
  margin-bottom: 96px;
  box-shadow: $box-shadow-elevation-1;
}

.previews-blocked {
  width: 100%;
  background-color: $main-dark-bg;
  box-shadow: $box-shadow-elevation-1;
  border-radius: 7px;
  border: 1px solid $dark-text-3;
  padding: 32px;

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;

    svg {
      width: 40px;
      height: 40px;
    }

    button {
      cursor: none;
    }
  }
}

@media (min-width: $sm-breakpoint) {
  h1 {
    text-align: center;
  }

  .audio-list {
    gap: 32px;
  }
}

@media (min-width: $md-breakpoint) {
  .audio-list {
    grid-template-columns: 1fr 1fr;
  }
  .previews-blocked .content .svg {
    width: 80px;
    height: 80px;
  }
}

@media (min-width: $xxl-breakpoint) {
  h1 {
    margin-bottom: 48px;
  }
}

@media (min-width: $xxxl-breakpoint) {
  .audio-list {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
