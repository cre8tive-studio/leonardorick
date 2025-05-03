<template>
  <div
    class="image-container"
    :class="size"
  >
    <transition
      name="image-fade"
      mode="out-in"
    >
      <NuxtImg
        :key="imageUrl"
        height="500"
        width="500"
        :src="imageUrl"
        :alt="$t('alt.cover_image', { songName: audio?.title })"
        preload
      />
    </transition>
    <transition
      name="image-fade"
      mode="out-in"
    >
      <div
        v-if="!loaded"
        class="loading-overlay"
      />
    </transition>
    <div
      v-if="shouldShowMediaOverlay"
      class="media-overlay"
    >
      <LRMediaLinks
        v-if="audio"
        :audio="audio"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AudioCardSizeOptions } from '~/types/audio-card-size.options';
import type { AudioModel } from '~/types/audio.model';

interface Props {
  audio?: AudioModel;
  size?: AudioCardSizeOptions;
}

const { audio, size = 'md' } = defineProps<Props>();

const { getCachedFile } = useCachedFile();

const imageUrl = ref('/images/empty-cover.jpg');
const loaded = ref(false);

const shouldShowMediaOverlay = computed(() => size === 'sm' && (audio?.appleMusic || audio?.spotify));

useWhenReady(
  () => audio,
  async () => {
    if (!audio?.imageUrl) {
      loaded.value = true;
      return;
    }

    imageUrl.value = URL.createObjectURL(
      await getCachedFile({ fileId: `${audio.id}-image`, url: audio.imageUrl, method: 'get' })
    );
    loaded.value = true;
  }
);
</script>

<style scoped lang="scss">
.image-fade-enter-active,
.image-fade-leave-active {
  transition: all 0.3s $default-ease;
}

.image-fade-enter-from,
.image-fade-leave-to {
  opacity: 0;
}

.image-container {
  --box-shadow03: 6px 6px 12px #151618, -6px -6px 12px #202024;
  position: relative;
  min-width: 170px;
  max-width: min(550px, 100%);
  max-height: 550px;
  height: 75%;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;

  img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 50%;
    outline: 10px solid #1a1d21;
    overflow: hidden;
    box-shadow: var(--box-shadow03);
  }

  .image {
    opacity: 0.5;
    transition: opacity 0.4s ease-in-out;

    &.loaded {
      opacity: 1;
    }
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

  .loading-overlay {
    @extend .base-loader;
    border-radius: 50%;
    height: 100%;
    width: 100%;
    top: 0;
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
  }
}

@media (max-width: $xl-breakpoint) {
  .image-container {
    &.md {
      width: 80%;
      margin-bottom: 12px;
    }
  }
}

@media (max-width: $lg-breakpoint) {
  .image-container.sm {
    height: 45%;
  }
}

@media (max-width: $sm-breakpoint) {
  .image-container.md {
    width: 260px;
    height: 260px;

    img {
      height: 100%;
      width: 100%;
      max-width: unset;
    }
  }
  .image-container.sm {
    width: 160px;
    height: 160px;
  }
}
</style>
