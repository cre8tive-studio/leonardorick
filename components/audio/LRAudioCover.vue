<template>
  <div
    class="image-container"
    :class="size"
  >
    <NuxtImg
      ref="featuredReleaseImageEl"
      :src="audio.imageUrl"
      :placeholder="placeholder"
    />
    <div
      v-if="shouldShowMediaOverlay"
      class="media-overlay"
    >
      <LRMediaLinks :audio="audio" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AudioModel } from '~/types/audio.model';
import placeholder from '~/assets/images/empty-cover.png';

interface Props {
  audio: AudioModel;
  size?: 'sm' | 'md';
}

const { audio, size = 'md' } = defineProps<Props>();

const shouldShowMediaOverlay = computed(() => size === 'sm' && (audio.appleMusic || audio.spotify));
</script>

<style scoped lang="scss">
.image-container {
  --box-shadow03: 6px 6px 12px #151618, -6px -6px 12px #202024;
  position: relative;
  height: 85%;
  img {
    height: 100%;
    border-radius: 50%;
    outline: 10px solid #1a1d21;
    box-shadow: var(--box-shadow03);
  }

  &.md {
    height: 85%;
  }

  &.sm {
    height: 65%;
  }

  .media-overlay {
    border-radius: 50%;
    height: 100%;
    width: 100%;
    top: 0;
    opacity: 0;
    background-color: rgba(0, 0, 0, 0.8);
    position: absolute;
    transition: opacity 0.3s $default-ease;

    display: flex;
    gap: 8px;

    align-items: center;
    justify-content: center;

    &:hover {
      background-color: rgba(0, 0, 0, 0.8);
      opacity: 1;
    }
  }
}
</style>
