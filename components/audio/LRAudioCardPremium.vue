<template>
  <div
    class="lr-audio-card-premium"
    :class="{ enabled: premiumAudio.enabled }"
  >
    <div class="flex flex-col justify-end h-full">
      <LRAudioCover
        class="audio-cover"
        place-holder-image-url="/images/previews-disco.png"
        size="sm"
        :show-image-overlay="isPreview"
        :audio="audio"
        :rotate="coverRotation"
      >
        <template
          v-if="isPreview"
          #image-overlay
        >
          <div class="votes-overlay">
            <button
              lr-cursor
              class="simple-action-button"
              :aria-label="$t('remove')"
              :disabled="isRemoveVoteDisabled(premiumAudio.number)"
              @click="removeVote(premiumAudio.number)"
            >
              <fa icon="minus" />
            </button>
            <button
              lr-cursor
              class="simple-action-button"
              :aria-label="$t('add')"
              :disabled="upvotesAvailable < 1"
              @click="addPreviewVote"
            >
              <fa icon="plus" />
            </button>
          </div>
        </template>
      </LRAudioCover>
      <p
        v-if="isDefined(votesCount)"
        ref="votesCountEl"
        class="votes-count"
        :class="{ 'has-vote': votesCount }"
      >
        <fa icon="heart" />

        <span class="votes-label">
          <i18n-t
            keypath="votes"
            :plural="votesCount"
          >
            <template #count>
              <transition
                name="transition-partial-fade"
                mode="out-in"
              >
                <span :key="votesCount">{{ votesCount }}</span>
              </transition>
            </template>
          </i18n-t>
        </span>
      </p>
    </div>

    <div class="content">
      <span class="preview-number lr-text--body-0-half mb-0 mb-2 md:mb-0">
        {{ typeMap[premiumAudio.type].title }} {{ premiumAudio.number }}
      </span>
      <h2 class="lr-text--body-1 mb-2">{{ premiumAudio.title }}</h2>

      <LRWavePlayer
        :enabled="premiumAudio.enabled"
        :audio-url="audioUrl"
        :eager="eager"
        size="md"
        @audioprocess="(currentTime) => (coverRotation = currentTime * 40)"
        @play="handlePlay"
      />
      <div class="actions">
        <button
          class="simple-action-button colorful-actions"
          lr-cursor
          :disabled="!premiumAudio.enabled"
          :aria-label="$t('download')"
          @click="downloadFile"
        >
          <fa icon="download" />
        </button>
        <button
          class="simple-action-button colorful-actions"
          lr-cursor
          :disabled="!premiumAudio.enabled"
        >
          <fa icon="bars" />
        </button>
      </div>
    </div>

    <LRRibbon
      v-if="premiumAudio.featured && premiumAudio.enabled"
      :text="$t('new')"
      type="featured"
    />
  </div>
</template>

<script setup lang="ts">
import { isDefined } from '@leonardorick/utils';
import { gsap } from 'gsap';
import type LRAudioCover from './LRAudioCover.vue';
import type LRWavePlayer from './LRWavePlayer.vue';
import { useAppStore } from '~/store';
import { useAudioStore } from '~/store/audio';
import type { PlayOptions } from '~/types/play.options';
import type { PremiumAudioModel } from '~/types/premium-audio.model';

interface Props {
  premiumAudio: PremiumAudioModel;
}
interface InfoPerType {
  url: string;
  title: string;
}

const { premiumAudio } = defineProps<Props>();

const { t: $t } = useI18n();
const { user } = toRefs(useAppStore());
const store = useAudioStore();
const { upvotes, upvotesAvailable } = toRefs(store);
const { addVote, removeVote, isRemoveVoteDisabled, download } = store;
const { removeFeaturedPreview } = useAppwrite();
const { getCachedFile, getCachedFileFromCache } = useCachedFile();

const typeMap: Record<PremiumAudioModel['type'], InfoPerType> = {
  preview: {
    url: 'getPreviewFile',
    title: $t('preview'),
  },
  cover: {
    url: 'getCoverFile',
    title: $t('cover'),
  },
};

const votesCountEl = ref<HTMLDivElement>();

const audioUrl = ref('');

const fileId = `premium-${premiumAudio.type}-${premiumAudio.number}`;
const loaded = ref(false);
const eager = ref(false);
const coverRotation = ref(0);

const audio = computed(() => ({ ...premiumAudio, fileId: '' })); // only for type compliance with audio cover
const isPreview = computed(() => premiumAudio.type === 'preview');
const votesCount = computed(() => (isPreview.value ? upvotes.value[premiumAudio.number]?.length || 0 : undefined));

onMounted(async () => {
  if (premiumAudio.enabled) {
    const data = await getCachedFileFromCache(fileId, true);

    if (data) {
      loaded.value = true;
      audioUrl.value = URL.createObjectURL(data);
    }
  }
});

onUnmounted(() => {
  if (audioUrl.value) URL.revokeObjectURL(audioUrl.value);
});

async function handlePlay($event: PlayOptions) {
  if (isPreview && $event === 'play' && user.value?.featuredPreviews?.includes(premiumAudio.number)) {
    removeFeaturedPreview(user.value.featuredPreviews, premiumAudio.number);
  }

  if ($event === 'play' && !loaded.value) {
    eager.value = true;
    await requestAudioFile();
  }
}

async function requestAudioFile() {
  loaded.value = true;
  const blob = await getCachedFile({
    fileId,
    url: `/api/${typeMap[premiumAudio.type].url}/${premiumAudio.number}`,
    authenticated: true,
    method: 'post',
    body: {
      number: premiumAudio.number,
    },
  });
  audioUrl.value = URL.createObjectURL(blob);
}

async function downloadFile() {
  if (!audioUrl.value) {
    await requestAudioFile();
  }

  download(audioUrl.value, `Leonardo Rick (${$t('preview')}) - ${premiumAudio.title}.mp3`);
}

async function addPreviewVote() {
  const result = await addVote(premiumAudio.number);
  if (result) {
    animateHeart();
  }
}

function animateHeart() {
  if (!votesCountEl.value) return;
  const svg = votesCountEl.value.querySelector('svg');
  if (!svg) return;

  gsap.to(svg, {
    color: '#ff0000',
    scale: 1.4,
    duration: 0.2,
    yoyo: true,
    repeat: 1,
    onComplete: () => {
      gsap.set(svg, { clearProps: 'all' });
    },
  });
}
</script>

<style scoped lang="scss">
.lr-audio-card-premium {
  padding: 24px;
  background-color: $dark-text-6;
  position: relative;

  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: center;

  box-shadow: $box-shadow-elevation-1;
  border-radius: 7px;
  transition: opacity 0.3s $default-ease;

  .audio-cover {
    margin-bottom: 30%;
  }

  // show votes overlay when hovering the votes label
  .audio-cover:has(~ .votes-count:hover) :deep(.image-overlay) {
    opacity: 1;
  }

  .votes-count {
    display: flex;
    align-items: center;
    text-align: center;
    gap: 6px;
    justify-content: center;
    width: 100%;
    height: 48px;

    .votes-label {
      min-width: 7ch;
      text-align: center;
    }
  }

  .votes-count:not(.has-vote) {
    color: $secondary-dark-text;
  }

  .preview-number {
    text-transform: uppercase;
    color: $secondary-dark-text;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;

    h2 {
      text-align: left;
    }
  }

  &:not(.enabled) {
    opacity: 0.7;
    background: repeating-linear-gradient(45deg, $dark-text-5, $dark-text-5 10px, $dark-text-6 10px, $dark-text-6 20px);
  }

  .actions {
    position: relative;
    left: -12px;
    display: flex;
    align-items: center;

    button {
      height: 45px;
      width: 45px;

      svg {
        height: 20px;
        width: 20px;
      }
    }
  }

  .votes-overlay {
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 10%;
    button {
      flex: 1;
      aspect-ratio: 1 / 1;
      height: auto;
      padding-inline: 10%;

      display: flex; // makes the button a circle
      align-items: center;
      justify-content: center;

      &:disabled {
        color: $dark-text-5;
      }

      svg {
        height: 100%;
        width: 100%;
      }
    }
  }
}

@media (max-width: $md-breakpoint) {
  .lr-audio-card-premium {
    flex-direction: column;
    gap: 12px;

    .content {
      flex: inherit;
      width: 100%;
    }
  }
}
</style>
