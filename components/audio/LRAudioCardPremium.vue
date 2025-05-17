<template>
  <div
    class="lr-audio-card-premium"
    :class="{ enabled: premiumAudio.enabled }"
  >
    <div class="flex flex-col justify-end h-full">
      <div
        class="audio-cover-wrapper"
        :class="{ 'is-playing': wavePlayer?.wave?.isPlaying() }"
      >
        <LRAudioCover
          class="audio-cover"
          place-holder-image-url="/images/premium-disco.png"
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
        <div
          v-if="!premiumAudio.imageUrl"
          class="cover-number"
        >
          <span>{{ premiumAudio.number }}°</span>
        </div>
      </div>
      <p
        ref="votesCountEl"
        class="votes-count"
        :class="{ 'has-vote': votesCount }"
      >
        <template v-if="isDefined(votesCount)">
          <fa icon="heart" />

          <span class="votes-label">
            <i18n-t
              keypath="votes"
              :plural="votesCount"
              scope="global"
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
        </template>
      </p>
    </div>

    <div class="content">
      <span class="preview-number lr-text--body-0-half mb-0 mb-2 md:mb-0">
        {{ $t(typeMap[premiumAudio.type].title) }} {{ premiumAudio.number }}
      </span>
      <h2 class="lr-text--body-1 mb-2">{{ premiumAudio.title }}</h2>

      <LRWavePlayer
        v-if="mounted"
        ref="wavePlayer"
        :enabled="premiumAudio.enabled"
        :audio-blob="audioBlob"
        :eager="eager"
        size="md"
        @audioprocess="setCoverRotation"
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
          v-if="audio.lyrics"
          class="simple-action-button colorful-actions"
          lr-cursor
          :disabled="!premiumAudio.enabled"
          @click="shouldShowDetailsModal = true"
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

    <LRAudioDetailsModal
      :should-show-modal="shouldShowDetailsModal"
      :audio="audio"
      :wave="wavePlayer?.wave"
      @close="closeAudioDetailsModal"
      @download="downloadFile"
      @play="handlePlay"
    />
  </div>
</template>

<script setup lang="ts">
import { isDefined } from '@leonardorick/utils';
import { gsap } from 'gsap';
import { LRWavePlayer } from '#components';
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
    title: 'preview',
  },
  cover: {
    url: 'getCoverFile',
    title: 'cover',
  },
};

function closeAudioDetailsModal() {
  shouldShowDetailsModal.value = false;
}
const votesCountEl = ref<HTMLDivElement>();

const audioBlob = ref<Blob>();

const fileId = `premium-${premiumAudio.type}-${premiumAudio.number}`;
const wavePlayer = ref<InstanceType<typeof LRWavePlayer>>();
const shouldShowDetailsModal = ref(false);
const coverRotation = ref(0);

const eager = ref(true);
const mounted = ref(false); // so we can pass the right eager value to wave player mounting it only after knowing it.

const audio = computed(() => ({ ...premiumAudio, fileId: '' })); // only for type compliance with audio cover
const isPreview = computed(() => premiumAudio.type === 'preview');
const votesCount = computed(() => (isPreview.value ? upvotes.value[premiumAudio.number]?.length || 0 : undefined));

onMounted(async () => {
  if (!premiumAudio.enabled) {
    eager.value = false;
    mounted.value = true;
    return;
  }
  const blob = await getCachedFileFromCache(fileId, true);
  if (blob) {
    audioBlob.value = blob;
  } else {
    eager.value = false;
  }
  mounted.value = true;
});

async function handlePlay($event: PlayOptions) {
  if (isPreview && $event === 'play' && user.value?.featuredPreviews?.includes(premiumAudio.number)) {
    removeFeaturedPreview(user.value.featuredPreviews, premiumAudio.number);
  }

  if ($event === 'play' && !audioBlob.value) {
    eager.value = true;
    await requestAudioFile();
  }
}

function setCoverRotation(currentTime: number) {
  if (isPreview.value) {
    coverRotation.value = currentTime * 40;
  }
}

async function requestAudioFile() {
  const blob = await getCachedFile({
    fileId,
    url: `/api/${typeMap[premiumAudio.type].url}/${premiumAudio.number}`,
    authenticated: true,
    method: 'post',
    body: {
      number: premiumAudio.number,
    },
  });
  audioBlob.value = blob;
}

async function downloadFile() {
  if (!audioBlob.value) {
    await requestAudioFile();
  }

  download(URL.createObjectURL(audioBlob.value!), `Leonardo Rick (${$t('preview')}) - ${premiumAudio.title}.mp3`);
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

  .audio-cover-wrapper {
    margin-bottom: 30%;
    position: relative;

    &:hover,
    &.is-playing {
      .cover-number {
        opacity: 0;
      }
    }

    .cover-number {
      position: absolute;
      top: 0;
      border-radius: 50%;
      font-size: 20px;
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      transition: opacity 0.3s $default-ease;
      span {
        background-color: $secondary-dark-text;
        color: $dark-text-5;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        outline: 4px solid $dark-text-5;
      }
    }
  }

  // show votes overlay when hovering the votes label
  .audio-cover-wrapper:has(~ .votes-count:hover) {
    .cover-number {
      opacity: 0;
    }

    :deep(.image-overlay) {
      opacity: 1;
    }
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

    .audio-cover-wrapper {
      margin-bottom: 0.5rem;
    }

    .content {
      flex: inherit;
      width: 100%;
    }
  }
}
</style>
