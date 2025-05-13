import WaveSurfer from 'wavesurfer.js';
// this logic is for being able to keep the LRCursor component following the cursor vent when
// The user is pressing the cursor down inside the wavesurfer canvas. For some reason (probably
// because wavesurfer is inside a shadow-root or because the library do a stopPropagation) the mouse
// 'mousemove' was not reaching the document for us to listen so here we do some tricks and emit a
// synthetic event
const useWavesurferCanvasMouseHandler = () => {
  const canvas = ref<HTMLCanvasElement | null>();

  let wave: WaveSurfer;
  let container: HTMLElement;

  function activate(newWave: WaveSurfer, newContainer: HTMLElement) {
    // if activating again, cleanup previous listeners
    if (wave) {
      cleanupCanvasListeners();
    }
    wave = newWave;
    container = newContainer;
    wave.on('redrawcomplete', async () => {
      setupCanvasListeners();
    });

    wave.on('destroy', () => {
      cleanupCanvasListeners();
    });
  }

  onUnmounted(() => {
    cleanupCanvasListeners();
  });

  function waitForCanvas(): Promise<HTMLCanvasElement> {
    return new Promise((resolve) => {
      if (!wave) return;

      const newCanvas = wave.getWrapper().querySelector('canvas') as HTMLCanvasElement;
      if (newCanvas) return resolve(newCanvas);

      const observer = new MutationObserver(() => {
        if (!wave) return;
        const found = wave.getWrapper().querySelector('canvas') as HTMLCanvasElement;
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

  async function setupCanvasListeners() {
    await waitForCanvas().then((newCanvas) => {
      cleanupCanvasListeners();

      canvas.value = newCanvas;

      canvas.value.addEventListener('pointerdown', canvasPointerdownEventHandler);
      canvas.value.addEventListener('pointerup', canvasPointerupEventHandler);
      canvas.value.addEventListener('pointermove', canvasPointermoveEventHandler);
    });
  }

  function canvasPointerdownEventHandler(e: PointerEvent) {
    if (!canvas.value) return;
    canvas.value.setPointerCapture(e.pointerId);
  }

  function canvasPointerupEventHandler(e: PointerEvent) {
    if (!canvas.value) return;

    canvas.value.releasePointerCapture(e.pointerId);
  }

  function canvasPointermoveEventHandler(e: PointerEvent) {
    if (!canvas.value || !container) return;
    container.dispatchEvent(new MouseEvent('mousemove', e));
  }

  function cleanupCanvasListeners() {
    if (!canvas.value) return;

    canvas.value.removeEventListener('pointerdown', canvasPointerdownEventHandler);
    canvas.value.removeEventListener('pointerup', canvasPointerupEventHandler);
    canvas.value.removeEventListener('pointermove', canvasPointermoveEventHandler);
  }

  return {
    activate,
  };
};

export default useWavesurferCanvasMouseHandler;
