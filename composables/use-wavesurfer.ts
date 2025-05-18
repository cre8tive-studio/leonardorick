import WaveSurfer, { type WaveSurferOptions } from 'wavesurfer.js';
import { v4 as uuidv4 } from 'uuid';
import { COLORS } from '~/utils/constants/colors';
import mockPeaks from '~/public/jsons/audio-peaks.json';
import { useAudioStore } from '~/store/audio';
import type { AudioModel } from '~/types/audio.model';
import type { WaveSurferWithIdModel } from '~/types/wavesurfer-with-id.model';

const defaultWavesurferOptions: Partial<WaveSurferOptions> = {
  height: 'auto',
  cursorWidth: 5,
  barWidth: 2,
  barHeight: 0.7,
  barGap: 3,
  barRadius: 10,
};
const useWavesurfer = ({ shouldBeCopy = false }: { shouldBeCopy?: boolean } = {}) => {
  const wave = ref<WaveSurferWithIdModel>();
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
    continuousAndControlsPlayInterval,
    waveAudioMap,
  } = toRefs(audioStore);

  const { activate: activateCanvasMouseHandler } = useWavesurferCanvasMouseHandler();
  const { activate: activateCanvasMouseHandlerGlobal } = useWavesurferCanvasMouseHandler();

  onUnmounted(() => {
    if (!wave.value || isCopy.value) return;

    removeWaveFromList(wave.value);
    wave.value.destroy();
  });

  async function createWavesurfer(newContainer: HTMLElement, audioBlob: Blob, audio: AudioModel) {
    container.value = newContainer;

    if (wave.value) {
      removeWaveFromList(wave.value);
      wave.value.destroy();
    }

    const wavesurfer = WaveSurfer.create({
      ...defaultWavesurferOptions,
      container: newContainer,
      waveColor: COLORS.secondaryDarkText,
      cursorColor: COLORS.highlight,
      progressColor: getProgressGradient(),
      dragToSeek: true,
      url: URL.createObjectURL(audioBlob),
      normalize: false,
    }) as WaveSurferWithIdModel;

    (wavesurfer as WaveSurferWithIdModel).id = uuidv4();
    wave.value = wavesurfer;
    removeWaveFromList(wavesurfer);
    addWaveOnList(wavesurfer, audio);

    wavesurfer.on('finish', () => {
      playNext(wavesurfer);
    });

    activateCanvasMouseHandler(wavesurfer, newContainer);

    return wavesurfer;
  }

  function updateGlobalWavesurfer(newWave?: WaveSurferWithIdModel) {
    const w = newWave || wave.value;
    if (!globalWaveformEl.value) throw new Error('Attempt to update global wavesurfer but container is not defined');
    if (!w) throw new Error('Attempt to update global wavesurfer but current wave is not defined');

    if (lastPlayedWave.value === w && globalWave.value) return;

    if (globalWave.value) {
      globalWave.value.destroy();
    }

    lastPlayedWave.value = w;
    globalWave.value = createCopyWavesurfer(globalWaveformEl.value, w.getMediaElement());
    activateCanvasMouseHandlerGlobal(globalWave.value as WaveSurferWithIdModel, globalWaveformEl.value);
  }

  // use this if you want to use a copy of the wave and play pause it but don't want to create a new instance
  function setExternalWavesurfer(waveCopy: WaveSurferWithIdModel) {
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

  async function play(newWave?: WaveSurferWithIdModel, playLockedFromOutside?: boolean) {
    const w = newWave || wave.value;
    const locked = playLockedFromOutside ? false : playLocked.value;
    if (!w || locked) return;

    if (!playLockedFromOutside) {
      playLocked.value = true;
    }

    for (const wi of waves.value.values()) {
      wi.pause();
    }

    // always create the copie before playing or much after the current wave is already playing for some time
    // also, it's important to call it after pausing the waves on the list so the copy also gets the right state
    updateGlobalWavesurfer(w);
    w.play();

    if ('mediaSession' in navigator) {
      const audio = waveAudioMap.value[w.id];
      if (!audio) return;

      navigator.mediaSession.metadata = new MediaMetadata({
        title: audio.title,
        artist: 'Leonardo Rick',
        artwork: [{ src: audio.imageUrl || '/images/premium-disco.png', sizes: '512x512', type: 'image' }],
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => playNext(w));
      navigator.mediaSession.setActionHandler('previoustrack', () => playPrevious(w));
    }

    if (!playLockedFromOutside) {
      playLocked.value = false;
    }
  }

  function playNext(currentWave: WaveSurferWithIdModel) {
    clearTimeout(continuousAndControlsPlayInterval.value);
    continuousAndControlsPlayInterval.value = setTimeout(() => {
      if (playLocked.value || waves.value.length < 2) return;
      playLocked.value = true;
      const index = waves.value.indexOf(currentWave);

      let w;
      if (waves.value[index + 1]) {
        w = waves.value[index + 1];
      } else {
        w = waves.value[0];
      }
      if (w) {
        w.setTime(0);
        currentWave.setTime(0);
        currentWave.pause();
        play(w as WaveSurferWithIdModel, true);
      }
      playLocked.value = false;
    }, 300);
  }

  function playPrevious(currentWave: WaveSurferWithIdModel) {
    clearTimeout(continuousAndControlsPlayInterval.value);
    continuousAndControlsPlayInterval.value = setTimeout(() => {
      if (playLocked.value || waves.value.length < 2) return;
      playLocked.value = true;

      if (currentWave.getCurrentTime() > 5) {
        currentWave.setTime(0);
        return;
      }

      const index = waves.value.indexOf(currentWave);

      let w;
      if (waves.value[index - 1]) {
        w = waves.value[index - 1];
      } else {
        w = waves.value[waves.value.length - 1];
      }
      if (w) {
        w.setTime(0);
        currentWave.setTime(0);
        currentWave.pause();
        play(w as WaveSurferWithIdModel, true);
      }
      playLocked.value = false;
    }, 300);
  }

  function changeSeconds(seconds: number) {
    if (!wave.value) return;
    return wave.value.setTime(wave.value.getCurrentTime() + seconds);
  }

  function createCopyWavesurfer(newContainer: HTMLElement, mediaElement: HTMLMediaElement, peaks?: number[][]) {
    const wavesurfer = WaveSurfer.create({
      ...defaultWavesurferOptions,
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
    (wavesurfer as WaveSurferWithIdModel).id = uuidv4();
    return wavesurfer as WaveSurferWithIdModel;
  }

  function createMockWavesurfer(newContainer: HTMLElement) {
    const wavesurfer = WaveSurfer.create({
      ...defaultWavesurferOptions,
      container: newContainer,
      waveColor: COLORS.darkText3,
      cursorColor: COLORS.darkText4,
      normalize: false,
    });
    (wavesurfer as WaveSurferWithIdModel).id = uuidv4();

    wavesurfer.load(
      'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU2LjM2LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU2LjQxAAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//MUZAAAAAGkAAAAAAAAA0gAAAAATEFN//MUZAMAAAGkAAAAAAAAA0gAAAAARTMu//MUZAYAAAGkAAAAAAAAA0gAAAAAOTku//MUZAkAAAGkAAAAAAAAA0gAAAAANVVV',
      [mockPeaks.data]
    );
    return wavesurfer as WaveSurferWithIdModel;
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
