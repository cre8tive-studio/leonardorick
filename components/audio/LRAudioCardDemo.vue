<template>
  <div class="lr-audio-card-demo">
    <LRAudioCover :audio="demo" />

    <div class="content">
      <h2 class="lr-text--body-1 mb-2">{{ demo.title }}</h2>
      <p>votes: {{ upvotes[demo.number]?.length }}</p>
      <LRWavePlayer
        :audio-url="audioUrl"
        size="sm"
      />

      <div class="flex gap-4">
        <button
          :disabled="upvotesAvailable < 1"
          class="bg-neutral-400 [&:not(:disabled)]:hover:bg-neutral-500 p-2 disabled:cursor-not-allowed"
          @click="addVote(demo.number)"
        >
          vote
        </button>

        <button
          :disabled="isRemoveVoteDisabled"
          class="bg-neutral-400 [&:not(:disabled)]:hover:bg-neutral-500 p-2 disabled:cursor-not-allowed"
          @click="removeVote(demo.number)"
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
import type { DemoClientModel } from '~/types/demo-client.model';

const { userId } = toRefs(useAppStore());
const store = useAudioStore();
const { upvotes, upvotesAvailable, demosMaxVotes } = toRefs(store);
const { addVote, removeVote } = store;

const isRemoveVoteDisabled = computed(
  () => upvotesAvailable === demosMaxVotes || !upvotes.value[demo.number]?.includes(userId.value)
);

interface Props {
  demo: DemoClientModel;
}
const { demo } = defineProps<Props>();
const { getCachedFile } = useCachedFile();
const audioUrl = ref('');

getCachedFile({ fileId: demo.fileId, url: '/api/getDemoFile', authenticated: true, method: 'post' }).then((data) => {
  audioUrl.value = URL.createObjectURL(data);
});
</script>

<style scoped lang="scss">
.lr-audio-card-demo {
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
