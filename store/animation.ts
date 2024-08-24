import type { Fluid } from '~/components/FluidBackground/fluid';

interface animationStoreModel {
  isEnteringAnimationFinished: boolean;
  isLRModelLoaded: boolean;
  isLRModelTimedout: boolean;
  isOverlayCompleteHidden: boolean;
  loadingProgress: number;
  loadingTotal: number;
  fluid: Fluid | null;
  fluidCanvas: HTMLCanvasElement | undefined;
  logoCanvas: HTMLCanvasElement | undefined;
  loadingBarRef: HTMLDivElement | undefined;
  logoOverlayRef: HTMLDivElement | undefined;
  cubeLoaderContainerRef: HTMLDivElement | undefined;
  cursorOuter: HTMLDivElement | undefined;
  cursorInner: HTMLDivElement | undefined;
  cursorActivated: boolean;
}
export const useAnimationStore = defineStore('animationStore', () => {
  const state = reactive<animationStoreModel>({
    isEnteringAnimationFinished: false,
    isLRModelLoaded: false,
    isLRModelTimedout: false,
    isOverlayCompleteHidden: false,
    loadingProgress: 0,
    loadingTotal: 0,
    fluid: null,
    fluidCanvas: undefined,
    logoCanvas: undefined,
    loadingBarRef: undefined,
    logoOverlayRef: undefined,
    cubeLoaderContainerRef: undefined,
    cursorOuter: undefined,
    cursorInner: undefined,
    cursorActivated: false,
  });

  const changeScrollLayoutOverflow = (overflow: 'auto' | 'hidden') => {
    document.body.style.overflowY = overflow;
  };

  return {
    ...toRefs(state),
    changeScrollLayoutOverflow,
  };
});
