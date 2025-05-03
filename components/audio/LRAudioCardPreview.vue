<template>
  <div class="lr-audio-card-preview">
    <LRAudioCover :audio="preview" />

    <div class="content">
      <h2 class="lr-text--body-1 mb-2">{{ preview.title }}</h2>
      <p>votes: {{ upvotes[preview.number]?.length }}</p>
      <LRWavePlayer
        :audio-url="audioUrl"
        size="sm"
      />

      <div class="flex gap-4">
        <button
          :disabled="upvotesAvailable < 1"
          class="bg-neutral-400 [&:not(:disabled)]:hover:bg-neutral-500 p-2 disabled:cursor-not-allowed"
          @click="addVote(preview.number)"
        >
          vote
        </button>

        <button
          :disabled="isRemoveVoteDisabled"
          class="bg-neutral-400 [&:not(:disabled)]:hover:bg-neutral-500 p-2 disabled:cursor-not-allowed"
          @click="removeVote(preview.number)"
        >
          remove vote
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/store';
import { useAudioStore } from '~/store/audio';
import type { PreviewClientModel } from '~/types/preview.model';

const { userId } = toRefs(useAppStore());
const store = useAudioStore();
const { upvotes, upvotesAvailable, previewsMaxVotes } = toRefs(store);
const { addVote, removeVote } = store;

const isRemoveVoteDisabled = computed(
  () => upvotesAvailable === previewsMaxVotes || !upvotes.value[preview.number]?.includes(userId.value)
);

interface Props {
  preview: PreviewClientModel;
}
const { preview } = defineProps<Props>();
const { getCachedFile } = useCachedFile();
const audioUrl = ref('');

getCachedFile({ fileId: preview.fileId, url: '/api/getPreviewFile', authenticated: true, method: 'post' }).then(
  (data) => {
    audioUrl.value = URL.createObjectURL(data);
  }
);
</script>

<style scoped lang="scss">
.lr-audio-card-preview {
  height: 250px;
  padding-inline: 24px;
  background-color: $main-dark-bg;

  display: flex;
  gap: 24px;

  align-items: center;
  justify-content: center;

  box-shadow: $box-shadow-elevation-1;
  border-radius: 7px;
  transition: opacity 0.3s $default-ease;

  .content {
    display: flex;
    flex-direction: column;

    h2 {
      text-align: left;
    }
  }
}

@media (max-width: $lg-breakpoint) {
  .audio {
    height: 450px;
    flex-direction: column;
  }
}

@media (max-width: $sm-breakpoint) {
  .audio {
    height: 340px;
  }
}
</style>
