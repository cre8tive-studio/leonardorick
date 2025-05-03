<template>
  <div
    class="lr-wave-player flex flex-col gap-2"
    :class="size"
  >
    <div class="flex items-center w-full gap-2">
      <div
        ref="waveContainerEl"
        class="wave-container"
      >
        <div class="wave-placeholder" />
        <div
          ref="waveformEl"
          class="waveform flex-1"
        />
      </div>

      <LRPlayButton
        :wave="wave"
        :size="size"
        @play="playPause"
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
import { COLORS } from '~/utils/constants/colors';
import type { AudioCardSizeOptions } from '~/types/audio-card-size.options';

type Sizes = Record<AudioCardSizeOptions, (number | undefined)[]>;

type SizeMap = { height: Sizes; width: Sizes };

interface Props {
  audioUrl: string;
  size?: AudioCardSizeOptions;
}

interface Emits {
  (event: 'audioprocess', currentTime: number): void;
}

const { audioUrl, size = 'md' } = defineProps<Props>();

const $emit = defineEmits<Emits>();

const audioStore = useAudioStore();
const { waves, volume } = toRefs(audioStore);
const { addWaveOnList } = audioStore;

const breakpoints = useCssBreakpoints();

const waveContainerEl = ref<HTMLDivElement>();
const waveformEl = ref<HTMLDivElement>();
const wave = ref<WaveSurfer>();

const duration = ref('0:00');
const currentTime = ref('0:00');

const sizes: SizeMap = {
  height: {
    sm: [40, 40, 40, 40, 70, 90],
    md: [90, 90, 90, 160, 190, 190],
  },
  // width behaves like min-width
  width: {
    sm: [180, 180, 180, 180, 180, 180],
    md: [undefined, undefined, undefined, 300, 300, 300],
  },
};
const bpIndex = computed(() => BREAKPOINT_OPTIONS.indexOf(breakpoints.current.value || 'lg'));

onMounted(() => {
  const height = sizes.height[size][bpIndex.value];
  const width = sizes.width[size][bpIndex.value];

  setStyleVar('height', height);
  updateWaveMinWidth(width);

  useWhenReady(
    () => audioUrl,
    () => createWaveSurfer(height, width)
  );
});

watch(breakpoints.current, () => {
  if (!waveContainerEl.value || !breakpoints.current.value) return;

  const height = sizes.height[size][bpIndex.value];
  const width = sizes.width[size][bpIndex.value];

  if (wave.value) {
    wave.value.setOptions({ height });
  }

  setStyleVar('height', height);
  updateWaveMinWidth(width);
});

function updateWaveMinWidth(width?: number) {
  if (!wave.value) {
    if (!waveContainerEl.value) return;
    if (!width || getComputedWidth() >= width) {
      setStyleVar('width', undefined); // if computed is higher than width we set it to 100%
    } else {
      setStyleVar('width', width);
    }

    return;
  }

  const computed = getComputedWidth();
  const w = width && width > computed ? width : computed;
  if (wave.value.getWidth() < w) {
    wave.value.setOptions({ width: w });
    if (width) {
      setStyleVar('width', width);
    }
  }
}

function getComputedWidth() {
  if (!waveContainerEl.value) return 0;
  return parseInt(getComputedStyle(waveContainerEl.value).width.replace('px', ''));
}

function setStyleVar(orientation: 'width' | 'height', value?: number) {
  if (!waveContainerEl.value) return;

  if (value) {
    waveContainerEl.value.style.setProperty(`--wave-container-${orientation}`, `${value}px`);
  } else {
    waveContainerEl.value.style.setProperty(`--wave-container-${orientation}`, '100%');
  }
}

function createWaveSurfer(height?: number, width?: number) {
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context');
  }
  const gradient = ctx.createLinearGradient(0, 0, 0, 150);

  gradient.addColorStop(0, '#ffffff'); // Pure white at the top
  gradient.addColorStop(0.5, '#d9d9d9'); // Light gray in the middle
  gradient.addColorStop(1, '#a6a6a6'); // Soft gray at the bottom

  if (!waveformEl.value) throw new Error('Waveform container not defined on wave creation');

  const wavesurfer = WaveSurfer.create({
    height,
    cursorWidth: 5,
    barWidth: 2,
    barHeight: 0.7,
    barGap: 3,
    barRadius: 10,
    container: waveformEl.value,
    waveColor: COLORS.secondaryDarkText,
    cursorColor: COLORS.highlight,
    progressColor: gradient,
    url: audioUrl,
    normalize: false,
  });

  wave.value = wavesurfer;

  wavesurfer.on('interaction', () => play());

  wavesurfer.on('ready', () => {
    if (!waveContainerEl.value || !waveformEl.value || !wave.value) return;

    const placeholder = waveContainerEl.value.querySelector<HTMLElement>('.wave-placeholder');
    if (!placeholder) return;
    duration.value = formatSongTime(wavesurfer.getDuration());
    const tl = gsap.timeline();

    tl.to(placeholder, {
      opacity: 0,
      onComplete: () => {
        if (!waveContainerEl.value || !waveformEl.value || !placeholder) return;
        placeholder.style.display = 'none';
        waveformEl.value.style.display = 'block';
        updateWaveMinWidth(width);
      },
    });

    tl.to(waveformEl.value, {
      opacity: 1,
      delay: 0.1, // 100ms delay
    });
  });

  wavesurfer.on('audioprocess', () => {
    wavesurfer.setVolume(volume.value);
    const current = wavesurfer.getCurrentTime();
    currentTime.value = formatSongTime(current);
    $emit('audioprocess', current);
  });
  addWaveOnList(wavesurfer);
}

function playPause() {
  if (!wave.value) return;
  if (wave.value.isPlaying()) {
    wave.value.pause();
  } else {
    play();
  }
}

function play() {
  if (!wave.value) return;

  for (const w of waves.value.values()) {
    w.pause();
  }
  wave.value.play();
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
.wave-container {
  --wave-container-height: 0;
  --wave-container-width: 100%;
  height: var(--wave-container-height);
  flex: 1;
  display: flex;
  align-items: center;
  cursor: none;
}

.waveform {
  display: none;
  opacity: 0; // updated with gsap
}

.wave-timers {
  color: $secondary-dark-text;
  font-size: 14px;
  margin-right: calc(70px + 0.5rem + 12px); // button width + gap + margin
}

.wave-placeholder {
  height: calc(var(--wave-container-height) - 30px);
  width: var(--wave-container-width);

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

.sm {
  .wave-placeholder {
    min-width: 180px;
  }
}

@keyframes wave-loader-animation {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 0%;
  }
}

@media (max-width: $md-breakpoint) {
  .lr-wave-player.sm {
    gap: 0.25rem;
  }
}
</style>
