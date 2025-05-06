<template>
  <div
    class="lr-audio-card-premium"
    :class="{ enabled: premiumAudio.enabled }"
  >
    <div>
      <LRAudioCover
        class="mb-4"
        place-holder-image-url="/images/previews-disco.png"
        size="sm"
        :audio="premiumAudio"
      />
      <p
        v-if="isDefined(votesCount)"
        class="votes-count lr-text--body-0-half text-center w-full"
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
        size="md"
        @play="handlePlay"
      />

      <div
        v-if="isPreview"
        class="flex gap-4"
      >
        <button
          lr-cursor
          :disabled="isRemoveVoteDisabled"
          class="lr-button"
          @click="removeVote(premiumAudio.number)"
        >
          {{ $t('remove_vote') }}
        </button>
        <button
          lr-cursor
          :disabled="upvotesAvailable < 1"
          class="lr-button lr-button-secondary"
          @click="addVote(premiumAudio.number)"
        >
          {{ $t('vote') }}
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
import { useAppStore } from '~/store';
import { useAudioStore } from '~/store/audio';
import type { PlayOptions } from '~/types/play.options';
import type { PremiumAudioModel } from '~/types/premium-audio.model';

const { t: $t } = useI18n();
const { userId, user } = toRefs(useAppStore());
const store = useAudioStore();
const { upvotes, upvotesAvailable, previewsMaxVotes } = toRefs(store);
const { addVote, removeVote } = store;
const { removefeaturedPreview } = useAppwrite();

const isPreview = computed(() => premiumAudio.type === 'preview');
const votesCount = computed(() => (isPreview.value ? upvotes.value[premiumAudio.number]?.length || 0 : undefined));
const isRemoveVoteDisabled = computed(
  () => upvotesAvailable === previewsMaxVotes || !upvotes.value[premiumAudio.number]?.includes(userId.value)
);
interface Props {
  premiumAudio: PremiumAudioModel;
}
interface InfoPerType {
  url: string;
  title: string;
}
const { premiumAudio } = defineProps<Props>();
const { getCachedFile } = useCachedFile();
const audioUrl = ref('');

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

console.log(premiumAudio.imageUrl);

if (premiumAudio.enabled) {
  getCachedFile({
    fileId: `premium-${premiumAudio.type}-${premiumAudio.number}`,
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

function handlePlay($event: PlayOptions) {
  if (isPreview && $event === 'play' && user.value?.featuredPreviews?.includes(premiumAudio.number)) {
    removefeaturedPreview(user.value.featuredPreviews, premiumAudio.number);
  }
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
