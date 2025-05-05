<template>
  <ClientOnly>
    <div
      ref="musicPageEl"
      class="music-page lr-section-page-paddings"
    >
      <h1 class="lr-text--body-3 mt-12 mb-12 mx-auto">{{ $t('song_page_featured_title') }}</h1>
      <LRAudioCardFeatured
        class="featured"
        :audio="featuredRelease"
      />

      <h2 class="lr-text--body-2 mt-12 mb-6">{{ $t('song_page_original_songs_title') }}</h2>

      <div class="audio-list mb-24">
        <LRAudioCard
          v-for="release of remainingReleases"
          :key="release.id"
          :audio="release"
        />
      </div>
      <div class="divider height-1" />

      <div class="flex gap-3 items-center mb-6">
        <h2 class="lr-text--body-2">{{ $t('song_page_previews_title') }}</h2>
        <LRSubscriptionBadge v-if="subscription" />
      </div>
      <div
        v-if="session && subscription"
        ref="sessionEl"
        class="logged-content"
      >
        <div
          v-if="subscription.status === 'active'"
          class="active-content"
        >
          <div v-if="previewsMetadataLoaded">
            <div class="mb-6 flex">
              <p class="lr-text--body-0-half relative items-center">
                <span>{{ $t('votes_available') }}: {{ upvotesAvailable }}</span>
                <LRInfoIcon v-tooltip="$t('more_votes_previews_available_next_month')" />
              </p>
            </div>
            <div class="audio-list">
              <LRAudioCardPreview
                v-for="preview in previews"
                :key="preview.id"
                :preview="preview"
              />
            </div>
          </div>
          <div
            v-else
            class="loading-previews"
          />
        </div>

        <LRPreviewsBlocked v-else />
      </div>
      <LRPreviewsPaywall
        v-else
        @join-supporters-clicked="shouldShowModal = true"
      />

      <LRHowItWorksModal
        :should-show-modal="shouldShowModal"
        @close="shouldShowModal = false"
      />
    </div>
  </ClientOnly>
</template>
<script lang="ts" setup>
import type { PreviewClientModel } from '../types/preview.model';
import { useAppStore } from '../store/index';

import type { AudioModel } from '~/types/audio.model';
import LRHowItWorksModal from '~/components/modal/LRHowItWorksModal.vue';
import { useAudioStore } from '~/store/audio';
import LRPreviewsBlocked from '~/components/audio/LRPreviewsBlocked.vue';

const router = useRouter();
const route = useRoute();

const { session, subscription } = toRefs(useAppStore());
const { getUpvotes, getReleasesMetadata } = useAppwrite();
const { request } = useRequest();

// todo: remove
const audioStore = useAudioStore();
const { previews, upvotesAvailable, upvotes } = toRefs(audioStore);
const { setPreviews } = audioStore;

const releases = ref<AudioModel[]>([]);
const featuredRelease = ref<AudioModel>();
const shouldShowModal = ref(false);

const remainingReleases = computed(() =>
  releases.value.filter((release) => !release.featured).sort((a, b) => b.number - a.number)
);
const previewsMetadataLoaded = ref(false);

const sessionEl = ref<HTMLDivElement>();
const musicPageEl = ref<HTMLDivElement>();
const scrollToPreviewsTimeout = ref<NodeJS.Timeout>();

onMounted(async () => {
  loadReleases();
  await setLoggedInformation();

  // far from ideal solution but the only one I could find that works. On signup we observe the mutations on the screen until it's "stable"
  // so we are able to scroll to the previews section and show the user what is there
  if (route.query.login !== 'signup' || !musicPageEl.value) return;

  const observer = new MutationObserver(() => {
    // there's a lot of mutations going on  in sequence, we wait until no mutatation happens for some time and scroll
    if (scrollToPreviewsTimeout.value) clearTimeout(scrollToPreviewsTimeout.value);
    scrollToPreviewsTimeout.value = setTimeout(() => {
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

watch(subscription, (newSubscription, oldSubscription) => {
  if (oldSubscription && newSubscription && newSubscription.status !== oldSubscription.status) {
    if (newSubscription.status === 'active') {
      setLoggedInformation();
    }
  }
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
  if (!session.value || !subscription.value || subscription.value.status !== 'active') return;

  upvotes.value = await getUpvotes();

  request<PreviewClientModel[]>('/api/getPreviewsMetadata', { authenticated: true }).then(async (data) => {
    if (!data) {
      previewsMetadataLoaded.value = true;
      return;
    }
    setPreviews(data);
    previewsMetadataLoaded.value = true;
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

@media (min-width: $sm-breakpoint) {
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
