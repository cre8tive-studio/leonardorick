<template>
  <div
    ref="musicPageEl"
    class="music-page lr-section-page-paddings"
  >
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
      <div class="divider height-1" />
      <div
        v-if="session"
        ref="sessionEl"
        class="logged-content"
      >
        <h2 class="lr-text--body-2 mb-6">{{ $t('song_page_previews_title') }}</h2>
        <div v-if="demosMetadataLoaded">
          <p>votes available: {{ upvotesAvailable }}</p>
          <div class="audio-list">
            <LRAudioCardDemo
              v-for="demo in demos"
              :key="demo.id"
              :demo="demo"
            />
          </div>
        </div>
        <div
          v-else
          class="loading-previews"
        />
      </div>
      <LRPreviewsBlocked
        v-else
        @join-supporters-clicked="shouldShowModal = true"
      />
    </ClientOnly>
    <LRHowItWorksModal
      :should-show-modal="shouldShowModal"
      @close="shouldShowModal = false"
    />
  </div>
</template>
<script lang="ts" setup>
import type { DemoClientModel } from '../types/demo-client.model';
import { useAppStore } from '../store/index';

import type { AudioModel } from '~/types/audio.model';
import LRHowItWorksModal from '~/components/modal/LRHowItWorksModal.vue';
import { useAudioStore } from '~/store/audio';

const router = useRouter();
const route = useRoute();

const { session } = toRefs(useAppStore());
const { getUpvotes, getReleasesMetadata } = useAppwrite();
const { request } = useRequest();

// todo: remove
const audioStore = useAudioStore();
const { demos, upvotesAvailable, upvotes } = toRefs(audioStore);
const { setDemos } = audioStore;

const releases = ref<AudioModel[]>([]);
const featuredRelease = ref<AudioModel>();
const shouldShowModal = ref(false);

const remainingReleases = computed(() =>
  releases.value.filter((release) => !release.featured).sort((a, b) => b.number - a.number)
);
const demosMetadataLoaded = ref(false);

const sessionEl = ref<HTMLDivElement>();
const musicPageEl = ref<HTMLDivElement>();
const scrollToDemosTimeout = ref<NodeJS.Timeout>();

onMounted(async () => {
  loadReleases();
  await setLoggedInformation();

  // far from ideal solution but the only one I could find that works. On signup we observe the mutations on the screen until it's "stable"
  // so we are able to scroll to the demos section and show the user what is there
  if (route.query.login !== 'signup' || !musicPageEl.value) return;

  const observer = new MutationObserver(() => {
    // there's a lot of mutations going on  in sequence, we wait until no mutatation happens for some time and scroll
    if (scrollToDemosTimeout.value) clearTimeout(scrollToDemosTimeout.value);
    scrollToDemosTimeout.value = setTimeout(() => {
      if (!sessionEl.value) return;
      // You might want to debounce this or only run once
      sessionEl.value.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      observer.disconnect(); // Clean up after scrolling
      const { login: _, ...rest } = route.query;
      router.replace({ query: rest });
    }, 500);
  });

  observer.observe(musicPageEl.value, {
    childList: true,
    subtree: true,
  });
});

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
  if (!session.value) return;

  upvotes.value = await getUpvotes();

  request<DemoClientModel[]>('/api/getDemosMetadata', { authenticated: true }).then(async (data) => {
    if (!data) {
      demosMetadataLoaded.value = true;
      return;
    }
    setDemos(data);
    demosMetadataLoaded.value = true;
  });
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

.loading-previews {
  @extend .base-loader;
  height: 150px;
  border-radius: 16px;
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
