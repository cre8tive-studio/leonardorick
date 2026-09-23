<template>
  <div
    ref="self"
    class="image-container"
    :class="[size, { rotate }]"
  >
    <transition
      name="transition-partial-fade"
      mode="out-in"
    >
      <NuxtImg
        :key="imageUrl"
        class="image"
        :class="{ loaded }"
        height="500"
        width="500"
        :src="imageUrl"
        :alt="$t('alt.cover_image', { songName: audio?.title })"
        preload
        @load="handleImageLoad"
      />
    </transition>
    <transition
      name="transition-partial-fade"
      mode="out-in"
    >
      <div
        v-if="!loaded"
        class="loading-overlay"
      />
    </transition>
    <div
      v-if="shouldShowImageOverlay"
      class="image-overlay"
    >
      <slot name="image-overlay">
        <LRMediaLinks
          v-if="audio"
          :audio="audio"
        />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtImg } from '#components';
import type { AudioCardSizeOptions } from '~/types/audio-card-size.options';
import type { AudioModel } from '~/types/audio.model';

interface Props {
  audio?: AudioModel;
  size?: AudioCardSizeOptions;
  placeHolderImageUrl?: string;
  showImageOverlay?: boolean;
  rotate?: number;
}

const { audio, placeHolderImageUrl, size = 'lg', showImageOverlay = false, rotate = 0 } = defineProps<Props>();

const { getCachedFile } = useCachedFile();

const imageUrl = ref(placeHolderImageUrl || '/images/empty-cover.jpg');
const imageSourceReady = ref(false);
const loaded = ref(false);
const self = ref<HTMLDivElement>();

const shouldShowImageOverlay = computed(() => showImageOverlay);

defineExpose({ self });

function handleImageLoad(event: Event) {
  const image = event.target;
  if (!imageSourceReady.value || !(image instanceof HTMLImageElement)) return;
  if (audio?.imageUrl && image.currentSrc !== imageUrl.value) return;

  loaded.value = true;
}

async function prepareImageForReveal() {
  await nextTick();
  imageSourceReady.value = true;

  const img = self.value?.querySelector('img');
  loaded.value = Boolean(img?.complete && img.naturalWidth);
}

useWhenReady(
  () => audio,
  async () => {
    imageSourceReady.value = false;
    loaded.value = false;

    try {
      if (audio?.imageUrl) {
        imageUrl.value = URL.createObjectURL(
          await getCachedFile({ fileId: `${audio.id}-image`, url: audio.imageUrl, method: 'get' })
        );
        imageSourceReady.value = true;
        return;
      }
      await prepareImageForReveal();
    } catch {}
  }
);

watch(
  () => rotate,
  () => {
    if (!self.value) return;

    const img = self.value.querySelector('img');
    if (!img) return;
    img.style.setProperty('--background-rotation', `${rotate}deg`);
  }
);
</script>

<style scoped lang="scss">
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

  &.sm {
    max-width: 120px;
    width: 120px;
    min-width: auto;
    overflow: hidden;
    border-radius: 50%;
    height: fit-content;
    outline: 5px solid $dark-text-5;
    img {
      min-width: 122%;
      min-height: 122%;
      object-fit: cover;
      background-position: center;
    }
  }

  &.rotate {
    img {
      --background-rotation: 0;
      transform: rotate(var(--background-rotation));
    }
  }

  img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 50%;
    outline: 8px solid $dark-text-4;
    overflow: hidden;
    box-shadow: var(--box-shadow03);
    pointer-events: none;
  }

  .image {
    opacity: 0;
    transition: opacity 0.4s ease-in-out;

    &.loaded {
      opacity: 1;
    }
  }

  .image-overlay {
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
    &.lg {
      width: 80%;
      margin-bottom: 12px;
    }
  }
}

@media (max-width: $lg-breakpoint) {
  .image-container.md {
    height: 45%;
  }
}

@media (max-width: $sm-breakpoint) {
  .image-container.lg {
    width: 260px;
    height: 260px;

    img {
      height: 100%;
      width: 100%;
      max-width: unset;
    }
  }
  .image-container.md {
    width: 160px;
    height: 160px;
  }
}
</style>
