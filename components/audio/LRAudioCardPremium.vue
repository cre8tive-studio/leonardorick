<template>
  <div
    class="lr-audio-card-premium"
    :class="{ enabled: premiumAudio.enabled }"
  >
    <div>
      <LRAudioCover
        ref="coverEl"
        class="rotate"
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
              aria-label="Remove"
              :disabled="isRemoveVoteDisabled(premiumAudio.number)"
              @click="removeVote(premiumAudio.number)"
            >
              <fa icon="minus" />
            </button>
            <button
              lr-cursor
              class="simple-action-button"
              aria-label="Add"
              :disabled="upvotesAvailable < 1"
              @click="addVote(premiumAudio.number)"
            >
              <fa icon="plus" />
            </button>
          </div>
        </template>
      </LRAudioCover>
      <p
        v-if="isDefined(votesCount)"
        class="votes-count lr-text--body-0-half text-center w-full mt-4"
        :class="{ 'has-vote': votesCount }"
      >
        {{ $t('votes', { count: votesCount }) }}
      </p>
    </div>

    <div class="content">
      <span class="preview-number lr-text--body-0-half mb-0 mb-2 md:mb-0">
        {{ typeMap[premiumAudio.type].title }} {{ premiumAudio.number }}
      </span>
      <h2 class="lr-text--body-1 mb-2">{{ premiumAudio.title }}</h2>

      <LRWavePlayer
        class="mb-4"
        :enabled="premiumAudio.enabled"
        :audio-url="audioUrl"
        :eager="eager"
        size="md"
        @audioprocess="(currentTime) => (coverRotation = currentTime * 40)"
        @play="handlePlay"
      />
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
import type LRAudioCover from './LRAudioCover.vue';
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
const { addVote, removeVote, isRemoveVoteDisabled } = store;
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

const coverEl = ref<InstanceType<typeof LRAudioCover>>();

const audioUrl = ref('');

const fileId = `premium-${premiumAudio.type}-${premiumAudio.number}`;
const loaded = ref(false);
const eager = ref(false);
const coverRotation = ref(0);

const audio = computed(() => ({ ...premiumAudio, fileId: '' }));
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

function handlePlay($event: PlayOptions) {
  if (isPreview && $event === 'play' && user.value?.featuredPreviews?.includes(premiumAudio.number)) {
    removeFeaturedPreview(user.value.featuredPreviews, premiumAudio.number);
  }

  if ($event === 'play' && !loaded.value) {
    loaded.value = true;
    eager.value = true;
    requestAudioFile();
  }
}

function requestAudioFile() {
  getCachedFile({
    fileId,
    url: `/api/${typeMap[premiumAudio.type].url}/${premiumAudio.number}`,
    authenticated: true,
    method: 'post',
    body: {
      number: premiumAudio.number,
    },
  }).then((data) => {
    audioUrl.value = URL.createObjectURL(data);
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

    h2 {
      text-align: left;
    }
  }

  &:not(.enabled) {
    opacity: 0.7;
    background: repeating-linear-gradient(45deg, $dark-text-5, $dark-text-5 10px, $dark-text-6 10px, $dark-text-6 20px);
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

@media (max-width: $lg-breakpoint) {
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
