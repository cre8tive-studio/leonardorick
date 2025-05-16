<template>
  <div class="volume-slider">
    <div
      ref="bodyEl"
      class="slider-body"
    >
      <div
        ref="headEl"
        lr-cursor
        class="slider-head"
        @mousedown="mousedown"
        @mouseup="mouseup"
      >
        <transition
          name="transition-partial-fade"
          mode="out-in"
        >
          <fa
            :key="icon"
            :icon="icon"
          />
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { normalize, denormalize } from '@leonardorick/utils';
import { useAudioStore } from '~/store/audio';
import { localStorageClientSetItem } from '~/utils/js-utilities';

const BODY_HEIGHT = 120;
const HEAD_HEIGHT = 35;
const MAX = BODY_HEIGHT - HEAD_HEIGHT / 2;

const { volume } = toRefs(useAudioStore());

const headEl = ref<HTMLDivElement>();
const bodyEl = ref<HTMLDivElement>();
const bodyRect = ref<DOMRect>();

const icon = computed(() => {
  if (volume.value === 0) return 'volume-xmark';

  if (volume.value > 0.7) return 'volume-high';

  return 'volume-low';
});

const internalUpdate = ref(false);

onMounted(() => {
  if (!bodyEl.value || !headEl.value) return;
  bodyEl.value.style.setProperty('--body-height', `${BODY_HEIGHT}px`);
  headEl.value.style.setProperty('--head-height', `${HEAD_HEIGHT}px`);
  headEl.value.style.top = `${denormalize(volume.value, MAX, { inverted: true })}px`;

  watch(volume, () => {
    if (internalUpdate.value) return;
    updateSliderHeadPosition();
  });
});

function mousedown() {
  if (!bodyEl.value) return;

  bodyRect.value = bodyEl.value.getBoundingClientRect();
  document.addEventListener('mousemove', mousemove);
  window.addEventListener('mouseup', mouseup);
}

function mousemove(e: MouseEvent) {
  if (!headEl.value || !bodyEl.value) return;

  const body = bodyRect.value || bodyEl.value.getBoundingClientRect();
  const top = Math.min(Math.max(e.clientY - body.top - HEAD_HEIGHT / 2, 0), MAX);

  const newVolume = normalize(top, MAX, { inverted: true });
  internalUpdate.value = true;
  volume.value = newVolume;
  nextTick(() => {
    internalUpdate.value = false;
  });

  headEl.value.style.top = `${top}px`;
}

function updateSliderHeadPosition() {
  if (!headEl.value || !bodyEl.value) return;
  const top = normalize(volume.value, 1, { max: MAX, min: 0, inverted: true }); // get pixel position from volume
  headEl.value.style.top = `${top}px`;
}

function mouseup() {
  localStorageClientSetItem('volume', volume.value.toString());
  document.removeEventListener('mousemove', mousemove);
  document.removeEventListener('mouseup', mouseup);
}

onUnmounted(() => {
  document.removeEventListener('mousemove', mousemove);
  document.removeEventListener('mouseup', mouseup);
});
</script>

<style scoped lang="scss">
.volume-slider {
  position: absolute;
  right: 0;
  bottom: 0;
  padding-inline: var(--lr-side-space);
  padding-bottom: 5rem;
  margin-right: 1.5rem;
  opacity: 0.5;
  transition: opacity 0.3s $default-ease;

  &:hover {
    opacity: 1;
  }
}
.slider-body {
  --body-height: 0; // defined via js
  position: relative;
  width: 7px;
  height: var(--body-height);
  background-color: $dark-text-3;
  transition: background-color 0.3s $default-ease;
  border-radius: 20px;
}

.slider-head {
  pointer-events: auto;
  --head-height: 0; // defined via js
  width: var(--head-height);
  height: var(--head-height);
  background-color: $secondary-dark-text;
  position: relative;
  display: grid;
  place-items: center;
  left: 50%;
  transform: translateX(-51%);
  border-radius: 50%;
  box-shadow: $box-shadow-elevation-2;
  cursor: none;

  transition: background-color 0.3s $default-ease;
  svg {
    width: 14px;
    pointer-events: none;
    color: $dark-text-3;
  }

  &:hover {
    background-color: $main-dark-text;
    svg {
      color: $highlight;
    }
  }
}
</style>
