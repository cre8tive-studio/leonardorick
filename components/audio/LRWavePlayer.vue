<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center w-full gap-2">
      <div
        ref="waveContainerEl"
        class="wave-container"
      >
        <div
          class="wave-placeholder"
          :class="size"
        />
        <div
          ref="waveformEl"
          class="waveform flex-1"
        />
      </div>

      <LRPlayButton
        :wave="wave"
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

type SizeOptions = 'sm' | 'md';

type Sizes = Record<SizeOptions, Partial<Record<BreakpointOptions | 'default', number | undefined>>>;

interface Props {
  audioUrl: string;
  size?: SizeOptions;
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

const sizes: { height: Sizes; width: Sizes } = {
  height: {
    sm: {
      default: 40,
    },
    md: {
      default: 90,
      lg: 90,
      xl: 160,
      xxl: 190,
      xxxl: 190,
    },
  },
  width: {
    sm: {
      default: 180,
    },
    md: {
      default: undefined,
    },
  },
};

const height = breakpoints.current.value
  ? sizes.height[size][breakpoints.current.value] || sizes.height[size].default
  : sizes.height[size].default;
const width = sizes.width[size].default;

onMounted(() => {
  waveContainerEl.value?.style.setProperty('--wave-container-height', `${height}px`);
  waveContainerEl.value?.style.setProperty('--wave-container-width', `${width}px`);

  useWhenReady(
    () => audioUrl,
    () => createWaveSurfer()
  );
});

watch(breakpoints.current, () => {
  if (!wave.value || !waveContainerEl.value || !breakpoints.current.value) return;
  const h = sizes.height[size][breakpoints.current.value];
  if (h) {
    wave.value.setOptions({ height: h });
    waveContainerEl.value.style.setProperty('--wave-container-height', `${h}px`);
  }
});

function createWaveSurfer() {
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
    width,
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
    duration.value = formatTime(wavesurfer.getDuration());
    const tl = gsap.timeline();

    tl.to(placeholder, {
      opacity: 0,
      onComplete: () => {
        if (!waveContainerEl.value || !waveformEl.value || !placeholder) return;
        placeholder.style.display = 'none';
        waveformEl.value.style.display = 'block';
      },
    });

    tl.to(waveformEl.value, {
      opacity: 1,
      delay: 0.1, // 100ms delay
      onComplete: () => {
        if (!waveformEl.value) return;

        waveformEl.value.style.display = 'block';
      },
    });
  });

  wavesurfer.on('audioprocess', () => {
    wavesurfer.setVolume(volume.value);
    const current = wavesurfer.getCurrentTime();
    currentTime.value = formatTime(current);
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

function formatTime(time?: number) {
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
  --wave-container-width: 0;
  height: var(--wave-container-height);
  flex: 1;
  display: flex;
  align-items: center;
  cursor: none;
}

.waveform {
  display: none;
  opacity: 0;
}

.wave-timers {
  color: $secondary-dark-text;
  font-size: 14px;
  margin-right: calc(70px + 0.5rem + 12px); // button width + gap + margin
}

.wave-placeholder {
  height: calc(var(--wave-container-height) - 30px);
  width: 100%;

  display: flex;
  align-items: end;
  justify-content: center;
  gap: 4px;
  padding-block: 12px;

  background: repeating-linear-gradient(to right, $dark-text-3 0px, $dark-text-3 3px, transparent 3px, transparent 6px);

  background-size: 200% 100%;
  animation: wave-loader-animation 20s linear infinite;
  border-radius: 6px;
  mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);

  &.sm {
    width: 180px;
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
</style>
