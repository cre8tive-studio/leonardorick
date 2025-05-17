<template>
  <div
    ref="selfEl"
    class="lr-float-audio"
    :class="{ visible }"
  >
    <button
      lr-cursor
      class="dragger simple-action-button"
      @click="showHide"
    >
      <fa
        ref="iconEl"
        :icon="currentIcon"
      />
    </button>

    <div
      ref="waveformEl"
      class="waveform"
    />
    <div class="player flex items-center gap-2">
      <button
        lr-cursor
        class="change-time-button ml-4"
        @click="changeSeconds(-15)"
      >
        <SvgoBackward15Seconds />
      </button>
      <LRPlayButton
        :wave="(globalWave as WaveSurferWithIdModel)"
        :size="'md'"
        @play="localPlayPause"
      />
      <button
        lr-cursor
        class="change-time-button"
        @click="changeSeconds(15)"
      >
        <SvgoForward15Seconds lr-cursor />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import type { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useAudioStore } from '~/store/audio';
import { COLORS } from '~/utils/constants/colors';
import SvgoBackward15Seconds from '~/assets/icons/backward-15-seconds.svg';
import SvgoForward15Seconds from '~/assets/icons/forward-15-seconds.svg';
import useWavesurfer from '~/composables/use-wavesurfer';
import type { WaveSurferWithIdModel } from '~/types/wavesurfer-with-id.model';

const { globalWaveformEl, globalWave } = toRefs(useAudioStore());
const { setExternalWavesurfer, changeSeconds } = useWavesurfer({ shouldBeCopy: true });

const waveformEl = ref<HTMLDivElement | null>(null);
const selfEl = ref<HTMLDivElement>();
const iconEl = ref<InstanceType<typeof FontAwesomeIcon>>();
const currentIcon = ref<'chevron-up' | 'chevron-down'>('chevron-up');

const visible = ref(false);

const HEIGHT = 120;
const DRAGGER_HEIGHT = 40;

onMounted(async () => {
  // todo: remove
  selfEl.value!.style.setProperty('--height', `${HEIGHT}px`);
  selfEl.value!.style.setProperty('--dragger-height', `${DRAGGER_HEIGHT}px`);

  // acts like onMounted
  globalWaveformEl.value = waveformEl.value;

  useWhenReady(globalWave, () => {
    if (!selfEl.value) return;
    gsap.to(selfEl.value, { y: -DRAGGER_HEIGHT, duration: 0.2 });
  });

  watch(globalWave, () => {
    if (!globalWave.value) return;
    setExternalWavesurfer(globalWave.value as WaveSurferWithIdModel);
  });
});

onUnmounted(() => {
  cleanupGlobalWave();
});

function showHide() {
  if (!selfEl.value || !iconEl.value) return;
  visible.value = !visible.value;

  const tl = gsap.timeline();
  if (visible.value) {
    tl.to(selfEl.value, { y: -(HEIGHT + DRAGGER_HEIGHT), duration: 0.3, ease: 'power4.out' });
    tl.to(
      iconEl.value.$el,
      {
        opacity: 0,
        duration: 0.15,
        ease: 'power4.out',
        onComplete: () => {
          if (!iconEl.value) return;
          currentIcon.value = 'chevron-down';
          gsap.to(iconEl.value.$el, { opacity: 1, color: COLORS.mainDarkTextHslDarker, duration: 0.15 });
        },
      },
      '<'
    );
  } else {
    tl.to(selfEl.value, { y: -DRAGGER_HEIGHT, duration: 0.3, ease: 'power4.out' });
    tl.to(
      iconEl.value.$el,
      {
        opacity: 0,
        duration: 0.15,
        ease: 'power4.out',
        onComplete: () => {
          if (!iconEl.value) return;
          currentIcon.value = 'chevron-up';
          gsap.to(iconEl.value.$el, { opacity: 0.5, color: COLORS.darkText4, duration: 0.15 });
        },
      },
      '<'
    );
  }
}

function cleanupGlobalWave() {
  if (!globalWave.value) return;
  globalWave.value.destroy();
  globalWave.value = null;
  globalWaveformEl.value = null;
}

function localPlayPause() {
  if (!globalWave.value) return;

  globalWave.value.playPause();
}
</script>

<style scoped lang="scss">
.lr-float-audio {
  --height: -1;
  --dragger-height: -1;
  padding-inline: 32px;
  background-color: $dark-text-6;
  border: 2px solid $dark-text-4;
  border-radius: 25px;
  height: var(--height);
  width: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $box-shadow-elevation-1;
  cursor: none;

  position: fixed;
  bottom: calc((var(--height) * -1) - var(--dragger-height));

  z-index: 950;

  left: 50%;
  transform: translateX(-50%);

  .dragger {
    height: var(--dragger-height);
    width: var(--dragger-height);
    background-color: $dark-text-6;
    border: 2px solid $dark-text-4;
    border-radius: 50%;
    margin: 0 auto;
    position: absolute;
    top: calc(var(--dragger-height) / 1.7 * -1);
    cursor: none;
  }

  .waveform {
    position: relative;
    height: 80px;
    flex: 1;
  }

  .dragger svg {
    color: $dark-text-4;
    opacity: 0.5;
  }

  &.visible .dragger svg {
    color: $dark-text-3;
  }
}
.player {
  .change-time-button {
    height: 30px;
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: none;

    &:hover {
      svg {
        color: $highlight-3;
      }
    }
    svg {
      transition: color 0.3s $default-ease;
      color: $secondary-dark-text;
      font-size: 24px;
      pointer-events: none;
    }
  }
}
@media (max-width: $sm-breakpoint) {
  .lr-float-audio {
    width: 80%;
    min-width: 350px;
  }
}
</style>
