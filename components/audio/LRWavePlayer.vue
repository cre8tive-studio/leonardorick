<template>
  <div
    class="lr-wave-player"
    :class="size"
  >
    <div class="flex items-center w-full gap-2">
      <div
        ref="waveContainerEl"
        class="wave-container"
        :class="size"
      >
        <template v-if="eager || audioBlob">
          <div class="wave-loader" />
          <div
            ref="waveformEl"
            class="waveform flex-1"
          />
        </template>

        <LRWavePlaceholder v-else />
      </div>

      <LRPlayButton
        :wave="wave"
        :size="size"
        :enabled="enabled"
        @play="localPlayPause"
      />
    </div>
    <div class="wave-timers flex justify-between">
      <span>{{ currentTime }}</span>
      <span>{{ duration }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import WaveSurfer from 'wavesurfer.js';
import { gsap } from 'gsap';
import { useAudioStore } from '~/store/audio';
import type { AudioCardSizeOptions } from '~/types/audio-card-size.options';
import type { PlayOptions } from '~/types/play.options';
import useWavesurfer from '~/composables/use-wavesurfer';

interface Props {
  audioBlob: Blob | undefined;
  enabled?: boolean;
  eager?: boolean;
  size?: Exclude<AudioCardSizeOptions, 'sm'>;
}

interface Emits {
  (event: 'audioprocess', currentTime: number): void;
  (e: 'play', value: PlayOptions): void;
}

const { enabled = true, eager = true, audioBlob, size = 'lg' } = defineProps<Props>();

const $emit = defineEmits<Emits>();

const { volume } = toRefs(useAudioStore());

const breakpoints = useCssBreakpoints();
const ws = useWavesurfer();
const { createWavesurfer, playPause, play } = ws;
const { wave } = ws;

const waveContainerEl = ref<HTMLDivElement>();
const waveformEl = ref<HTMLDivElement>();

const duration = ref('0:00');
const currentTime = ref('0:00');

const waveMounted = ref(false);

onMounted(() => {
  waveMounted.value = eager;
  useWhenReady(
    () => audioBlob,
    async () => {
      await nextTick(); // ensure that template is already showing the waveformEl container
      localCreateWavesurfer();
    }
  );
});

watch(breakpoints.current, () => {
  if (wave.value) {
    wave.value.setOptions({ height: getComputedHeight() });
  }
});

async function localCreateWavesurfer() {
  if (!enabled) return;
  if (!waveformEl.value) throw new Error('Waveform container not defined on wave creation');
  if (!audioBlob) throw new Error('Attempt to create wavesurfer without blob');

  const wavesurfer = await createWavesurfer(waveformEl.value, audioBlob);

  wavesurfer.on('audioprocess', () => {
    wavesurfer.setVolume(volume.value);
    const current = wavesurfer.getCurrentTime();
    currentTime.value = formatSongTime(current);
    $emit('audioprocess', current);
  });

  replaceWaveLoader(wavesurfer);
}

function replaceWaveLoader(wavesurfer: WaveSurfer) {
  wavesurfer.on('ready', () => {
    console.log('ready!!!');
    if (!waveContainerEl.value || !waveformEl.value) return;

    const waveLoader = waveContainerEl.value.querySelector<HTMLElement>('.wave-loader');
    if (!waveLoader) return;
    duration.value = formatSongTime(wavesurfer.getDuration());
    const tl = gsap.timeline();

    tl.to(waveLoader, {
      opacity: 0,
      onComplete: () => {
        if (!waveContainerEl.value || !waveformEl.value || !waveLoader) return;
        waveLoader.style.display = 'none';
        waveformEl.value.style.display = 'block';
      },
    });

    tl.to(waveformEl.value, {
      opacity: 1,
      delay: 0.1, // 100ms delay
    });

    if (!waveMounted.value) {
      waveMounted.value = true;
      play();
    }
  });
}

function getComputedHeight() {
  if (!waveContainerEl.value) return 0;
  return parseInt(getComputedStyle(waveContainerEl.value).height.replace('px', ''));
}

async function localPlayPause($event: PlayOptions) {
  $emit('play', $event);
  playPause();
}

function formatSongTime(time?: number) {
  if (!time) return '0:00';
  return [
    Math.floor((time % 3600) / 60), // minutes
    ('00' + Math.floor(time % 60)).slice(-2), // seconds
  ].join(':');
}
</script>

<style scoped lang="scss">
.lr-wave-player {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  justify-content: center;
}

.wave-container {
  --wave-container-height: 60px;
  height: var(--wave-container-height);
  flex: 1;
  display: flex;
  align-items: center;
  cursor: none;
  min-width: 180px;

  &.md {
    --wave-container-height: 60px;
  }

  &.lg {
    --wave-container-height: 150px;
  }
}

.md {
  .wave-loader {
    min-width: 180px;
  }
}

.waveform {
  display: none;
  opacity: 0; // updated with gsap
  height: 100%;
}

.wave-timers {
  color: $secondary-dark-text;
  font-size: 14px;
  margin-right: calc(70px + 0.5rem + 12px); // button width + gap + margin
}

.wave-loader {
  height: calc(var(--wave-container-height) - 15px);
  width: 100%;

  display: flex;
  align-items: end;
  justify-content: center;
  gap: 4px;
  padding-block: 12px;

  background: repeating-linear-gradient(to right, $dark-text-3 0%, $dark-text-3 50%, transparent 50%, transparent 100%);
  background-size: 5px 100%;
  animation: wave-loader-animation 17s linear infinite;
  border-radius: 6px;
  mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
}

@keyframes wave-loader-animation {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 0%;
  }
}

@media (min-width: $md-breakpoint) {
  .lr-wave-player {
    .wave-container {
      --wave-container-height: 100px;

      &.md {
        --wave-container-height: 100px;
      }

      &.lg {
        gap: 0.25rem;
        --wave-container-height: 200px;
      }
    }
  }
}
</style>
