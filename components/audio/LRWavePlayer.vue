<template>
  <div class="wave-container flex flex-col gap-2">
    <div class="flex items-center w-full gap-2">
      <div
        id="waveform"
        ref="waveformEl"
        class="flex-1"
      />
      <LRPlayButton
        v-if="wave"
        :wave="wave"
        @play="playPause"
      />
    </div>
    <div
      v-if="wave"
      class="wave-timers flex justify-between"
    >
      <span>{{ currentTime }}</span>
      <span>{{ duration }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import WaveSurfer from 'wavesurfer.js';
import { useAudioStore } from '~/store/audio';
import { COLORS } from '~/utils/constants/colors';

interface Props {
  audioUrl: string;
  size?: 'sm' | 'md';
}

interface Emits {
  (event: 'audioprocess', currentTime: number): void;
}

const { audioUrl, size = 'md' } = defineProps<Props>();

const $emit = defineEmits<Emits>();

const audioStore = useAudioStore();
const { waves } = toRefs(audioStore);
const { addWaveOnList } = audioStore;

const waveformEl = ref<HTMLDivElement>();
const wave = ref<WaveSurfer>();

const duration = ref('0:00');
const currentTime = ref('0:00');

const isMd = computed(() => size === 'md');

onMounted(() => {
  createWaveSurfer();
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

  const mediumProps: Partial<Parameters<typeof WaveSurfer.create>[0]> = {
    height: 90,
    width: undefined,
  };

  const wavesurfer = WaveSurfer.create({
    height: 40,
    cursorWidth: 5,
    barWidth: 2,
    barHeight: 0.7,
    width: 180,
    barGap: 3,
    barRadius: 10,
    container: waveformEl.value,
    waveColor: COLORS.secondaryDarkText,
    cursorColor: COLORS.highlight,
    progressColor: gradient,
    url: audioUrl,
    normalize: false,
    ...(isMd.value ? mediumProps : {}),
  });

  wave.value = wavesurfer;
  wavesurfer.on('interaction', () => play());
  wavesurfer.on('ready', () => {
    duration.value = formatTime(wavesurfer.getDuration());
  });
  wavesurfer.on('audioprocess', () => {
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
.wave-timers {
  color: $secondary-dark-text;
  font-size: 14px;
  margin-right: calc(70px + 0.5rem + 12px); // button width + gap + margin
}
</style>
