import WaveSurfer from 'wavesurfer.js';
import { isDefined } from '@leonardorick/utils';
import { COLORS } from '~/utils/constants/colors';
import mockPeaks from '~/public/jsons/audio-peaks.json';
import { useAudioStore } from '~/store/audio';

const useWavesurfer = (shouldBeCopy: boolean = false) => {
  const wave = ref<WaveSurfer>();
  const isCopy = ref(shouldBeCopy);
  const container = ref<HTMLElement | null>();

  const audioStore = useAudioStore();
  const { addWaveOnList, removeWaveFromList } = audioStore;
  const {
    lastPlayedWave,
    globalWaveformEl,
    globalWave,
    playLocked,
    waves,
    playNextInterval,
    continuousPlayingIndexList,
  } = toRefs(audioStore);

  const { activate: activateCanvasMouseHandler } = useWavesurferCanvasMouseHandler();
  const { activate: activateCanvasMouseHandlerGlobal } = useWavesurferCanvasMouseHandler();

  onUnmounted(() => {
    if (!wave.value || isCopy.value) return;

    removeWaveFromList(wave.value);
    wave.value.destroy();
  });

  async function createWavesurfer(newContainer: HTMLElement, audioBlob: Blob) {
    container.value = newContainer;

    if (wave.value) {
      removeWaveFromList(wave.value);
      wave.value.destroy();
    }

    const wavesurfer = WaveSurfer.create({
      height: 'auto',
      cursorWidth: 5,
      barWidth: 2,
      barHeight: 0.7,
      barGap: 3,
      barRadius: 10,
      container: newContainer,
      waveColor: COLORS.secondaryDarkText,
      cursorColor: COLORS.highlight,
      progressColor: getProgressGradient(),
      dragToSeek: true,
      url: URL.createObjectURL(audioBlob),
      normalize: false,
    });

    wave.value = wavesurfer;
    removeWaveFromList(wavesurfer);
    addWaveOnList(wavesurfer);

    wavesurfer.on('finish', () => {
      playNext();
    });

    activateCanvasMouseHandler(wavesurfer, newContainer);

    return wavesurfer;
  }

  function updateGlobalWavesurfer(newWave?: WaveSurfer) {
    const w = newWave || wave.value;
    if (!globalWaveformEl.value) throw new Error('Attempt to update global wavesurfer but container is not defined');
    if (!w) throw new Error('Attempt to update global wavesurfer but current wave is not defined');

    if (lastPlayedWave.value === w && globalWave.value) return;

    if (globalWave.value) {
      globalWave.value.destroy();
    }

    lastPlayedWave.value = w;
    globalWave.value = createCopyWavesurfer(globalWaveformEl.value, w.getMediaElement());
    activateCanvasMouseHandlerGlobal(globalWave.value as WaveSurfer, globalWaveformEl.value);
  }

  // use this if you want to use a copy of the wave and play pause it but don't want to create a new instance
  function setExternalWavesurfer(waveCopy: WaveSurfer) {
    isCopy.value = true;
    wave.value = waveCopy;
  }

  function playPause() {
    if (!wave.value) return;
    if (wave.value.isPlaying()) {
      wave.value.pause();
    } else {
      play();
    }
  }

  async function play() {
    if (!wave.value || playLocked.value) return;
    playLocked.value = true;

    updateGlobalWavesurfer(); // always create the copie before playing or much after the current wave is already playing for some time

    for (const w of waves.value.values()) {
      if (w.isPlaying()) {
        w.pause();
      }
    }

    wave.value.play();
    playLocked.value = false;
  }

  function playNext() {
    clearTimeout(playNextInterval.value);
    playNextInterval.value = setTimeout(() => {
      if (!wave.value || waves.value.length < 2) return;

      const index = waves.value.indexOf(wave.value);

      if (!continuousPlayingIndexList.value.length) {
        continuousPlayingIndexList.value = waves.value.map((_, i) => i).filter((i) => i !== index);
      }

      // attemp to play the next song in the waves list, if not, just play the first one in the list
      let newWavesIndex: number | undefined;
      const nextIndex = index + 1;
      const nextIndexPosition = continuousPlayingIndexList.value.findIndex((indexValue) => indexValue === nextIndex);

      if (nextIndexPosition !== -1) {
        newWavesIndex = nextIndex;
        continuousPlayingIndexList.value.splice(nextIndexPosition, 1);
      } else {
        newWavesIndex = continuousPlayingIndexList.value.shift();
      }

      if (!isDefined(newWavesIndex)) return;

      const anyPlaying = waves.value.find((w) => w.isPlaying());
      if (!anyPlaying) {
        const w = waves.value[newWavesIndex];
        if (w) {
          updateGlobalWavesurfer(w as WaveSurfer); // always create the copie before playing or much after the current wave is already playing for some time
          w.setTime(0);
          w.play();
        }
      }
    }, 500);
  }

  function changeSeconds(seconds: number) {
    if (!wave.value) return;
    return wave.value.setTime(wave.value.getCurrentTime() + seconds);
  }

  function createCopyWavesurfer(newContainer: HTMLElement, mediaElement: HTMLMediaElement, peaks?: number[][]) {
    return WaveSurfer.create({
      height: 'auto',
      cursorWidth: 5,
      barWidth: 2,
      barHeight: 0.7,
      barGap: 3,
      barRadius: 10,
      container: newContainer,
      waveColor: COLORS.secondaryDarkText,
      cursorColor: COLORS.highlight,
      progressColor: getProgressGradient(),
      dragToSeek: true,
      backend: 'MediaElement',
      normalize: false,
      media: mediaElement,
      ...(peaks ? { peaks } : {}),
    });
  }

  function createMockWavesurfer(newContainer: HTMLElement) {
    const wavesurfer = WaveSurfer.create({
      height: 'auto',
      cursorWidth: 5,
      barWidth: 2,
      barHeight: 0.7,
      barGap: 3,
      barRadius: 10,
      container: newContainer,
      waveColor: COLORS.darkText3,
      cursorColor: COLORS.darkText4,
      normalize: false,
    });

    wavesurfer.load(
      'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU2LjM2LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU2LjQxAAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//MUZAAAAAGkAAAAAAAAA0gAAAAATEFN//MUZAMAAAGkAAAAAAAAA0gAAAAARTMu//MUZAYAAAGkAAAAAAAAA0gAAAAAOTku//MUZAkAAAGkAAAAAAAAA0gAAAAANVVV',
      [mockPeaks.data]
    );
    return wavesurfer;
  }

  function getProgressGradient() {
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    const grad = ctx.createLinearGradient(0, 0, 0, 150);

    grad.addColorStop(0, '#ffffff'); // Pure white at the top
    grad.addColorStop(0.5, '#d9d9d9'); // Light gray in the middle
    grad.addColorStop(1, '#a6a6a6'); // Soft gray at the bottom
    return grad;
  }

  return {
    createWavesurfer,
    createMockWavesurfer,
    createCopyWavesurfer,
    setExternalWavesurfer,
    play,
    playPause,
    changeSeconds,
    wave,
  };
};

export default useWavesurfer;
