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
        <template v-if="eager || audioUrl">
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
import type { PlayOptions } from '~/types/play.options';

interface Props {
  audioUrl: string;
  enabled?: boolean;
  eager?: boolean;
  size?: Exclude<AudioCardSizeOptions, 'sm'>;
}

interface Emits {
  (event: 'audioprocess', currentTime: number): void;
  (e: 'play', value: PlayOptions): void;
}

const { enabled = true, eager = true, audioUrl, size = 'lg' } = defineProps<Props>();

const $emit = defineEmits<Emits>();

const audioStore = useAudioStore();
const { waves, volume } = toRefs(audioStore);
const { addWaveOnList } = audioStore;

const breakpoints = useCssBreakpoints();

const waveContainerEl = ref<HTMLDivElement>();
const waveformEl = ref<HTMLDivElement>();
const wave = ref<WaveSurfer>();

let canvas: HTMLCanvasElement | null = null;

const duration = ref('0:00');
const currentTime = ref('0:00');

onMounted(() => {
  useWhenReady(
    () => audioUrl,
    async () => {
      await nextTick(); // ensure that template is already showing the waveformEl
      createWaveSurfer();
    }
  );
});

if (!eager) {
  useWhenReady(
    () => eager,
    () => useWhenReady(wave, () => play())
  );
}

onUnmounted(() => {
  if (!canvas) return;
  cleanupCanvasListeners();
});

watch(breakpoints.current, () => {
  if (wave.value) {
    wave.value.setOptions({ height: getComputedHeight() });
  }
});

async function createWaveSurfer() {
  if (!enabled) return;
  if (!waveformEl.value) throw new Error('Waveform container not defined on wave creation');

  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context');
  }
  const gradient = ctx.createLinearGradient(0, 0, 0, 150);

  gradient.addColorStop(0, '#ffffff'); // Pure white at the top
  gradient.addColorStop(0.5, '#d9d9d9'); // Light gray in the middle
  gradient.addColorStop(1, '#a6a6a6'); // Soft gray at the bottom

  const wavesurfer = WaveSurfer.create({
    height: 'auto',
    cursorWidth: 5,
    barWidth: 2,
    barHeight: 0.7,
    barGap: 3,
    barRadius: 10,
    container: waveformEl.value,
    waveColor: COLORS.secondaryDarkText,
    cursorColor: COLORS.highlight,
    progressColor: gradient,
    dragToSeek: true,
    url: audioUrl,
    normalize: false,
  });

  wave.value = wavesurfer;
  replaceWaveLoader(wavesurfer);

  // this logic is for being able to keep the LRCursor component following the cursor vent when
  // The user is pressing the cursor down inside the wavesurfer canvas. For some reason (probably
  // because wavesurfer is inside a shadow-root or because the library do a stopPropagation) the mouse
  // 'mousemove' was not reaching the document for us to listen so here we do some tricks and emit a
  // synthetic event
  wavesurfer.on('redrawcomplete', async () => {
    await waitForCanvas().then((newCanvas) => {
      if (canvas) {
        cleanupCanvasListeners();
      }
      canvas = newCanvas;

      canvas.addEventListener('pointerdown', canvasPointerdownEventHandler);
      canvas.addEventListener('pointerup', canvasPointerupEventHandler);
      canvas.addEventListener('pointermove', canvasPointermoveEventHandler);
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

function replaceWaveLoader(wavesurfer: WaveSurfer) {
  wavesurfer.on('ready', () => {
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
  });
}

function waitForCanvas(): Promise<HTMLCanvasElement> {
  return new Promise((resolve) => {
    if (!wave.value) return;

    const newCanvas = wave.value.getWrapper().querySelector('canvas') as HTMLCanvasElement;
    if (newCanvas) return resolve(newCanvas);

    const observer = new MutationObserver(() => {
      if (!wave.value) return;
      const found = wave.value.getWrapper().querySelector('canvas') as HTMLCanvasElement;
      if (found) {
        observer.disconnect();
        resolve(found);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

function canvasPointerdownEventHandler(e: PointerEvent) {
  if (!canvas) return;
  canvas.setPointerCapture(e.pointerId);
}

function canvasPointerupEventHandler(e: PointerEvent) {
  if (!canvas) return;

  canvas.releasePointerCapture(e.pointerId);
}

function canvasPointermoveEventHandler(e: PointerEvent) {
  if (!canvas || !waveformEl.value) return;
  waveformEl.value.dispatchEvent(new MouseEvent('mousemove', e));
}

function cleanupCanvasListeners() {
  if (!canvas) throw new Error('attempted to cleanup canvas before setting listeners');

  canvas.removeEventListener('pointerdown', canvasPointerdownEventHandler);
  canvas.removeEventListener('pointerup', canvasPointerupEventHandler);
  canvas.removeEventListener('pointermove', canvasPointermoveEventHandler);
}

function getComputedHeight() {
  if (!waveContainerEl.value) return 0;
  return parseInt(getComputedStyle(waveContainerEl.value).height.replace('px', ''));
}

function playPause($event: PlayOptions) {
  $emit('play', $event);
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
