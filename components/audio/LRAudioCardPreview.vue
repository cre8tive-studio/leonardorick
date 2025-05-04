<template>
  <div class="lr-audio-card-preview">
    <div>
      <LRAudioCover
        class="mb-4"
        place-holder-image-url="/images/previews-disco.png"
        size="sm"
        :audio="preview"
      />
      <p
        v-if="isDefined(voteCount)"
        class="votes-count lr-text--body-0-half text-center w-full"
        :class="{ 'has-vote': voteCount }"
      >
        {{ voteCount }} {{ $t('votes', { count: voteCount }) }}
      </p>
    </div>

    <div class="content">
      <span class="preview-number lr-text--body-0-half mb-0 mb-2 md:mb-0">
        {{ $t('preview') }} {{ preview.number }}
      </span>
      <h2 class="lr-text--body-1 mb-2">{{ preview.title }}</h2>

      <LRWavePlayer
        class="mb-4"
        :audio-url="audioUrl"
        size="md"
      />

      <div class="flex gap-4">
        <button
          lr-cursor
          :disabled="isRemoveVoteDisabled"
          class="lr-button"
          @click="removeVote(preview.number)"
        >
          {{ $t('remove_vote') }}
        </button>
        <button
          lr-cursor
          :disabled="upvotesAvailable < 1"
          class="lr-button lr-button-secondary"
          @click="addVote(preview.number)"
        >
          {{ $t('vote') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isDefined } from '@leonardorick/utils';
import { useAppStore } from '~/store';
import { useAudioStore } from '~/store/audio';
import type { PreviewClientModel } from '~/types/preview.model';

const { userId } = toRefs(useAppStore());
const store = useAudioStore();
const { upvotes, upvotesAvailable, previewsMaxVotes } = toRefs(store);
const { addVote, removeVote } = store;

const voteCount = computed(() => upvotes.value[preview.number]?.length || 0);
const isRemoveVoteDisabled = computed(
  () => upvotesAvailable === previewsMaxVotes || !upvotes.value[preview.number]?.includes(userId.value)
);

interface Props {
  preview: PreviewClientModel;
}
const { preview } = defineProps<Props>();
const { getCachedFile } = useCachedFile();
const audioUrl = ref('');

getCachedFile({
  fileId: preview.fileId,
  url: `/api/getPreviewFile/${preview.number}`,
  authenticated: true,
  method: 'post',
}).then((data) => {
  audioUrl.value = URL.createObjectURL(data);
});
</script>

<style scoped lang="scss">
.lr-audio-card-preview {
  height: 320px;
  padding-inline: 24px;
  background-color: $dark-text-6;

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
}

@media (max-width: $lg-breakpoint) {
  .lr-audio-card-preview {
    height: 460px;
    flex-direction: column;
    gap: 12px;

    .content {
      flex: inherit;
      width: 100%;
    }
  }
}

@media (max-width: $sm-breakpoint) {
  .lr-audio-card-preview {
    height: 420px;
  }
}
</style>
