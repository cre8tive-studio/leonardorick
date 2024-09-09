import type { Fluid } from '~/components/FluidBackground/fluid';

interface AnimationStoreModel {
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
  isCursorActivated: boolean;
  isMagneticHoverActivated: boolean;
  isScrollEnabled: boolean;
}

export const useAnimationStore = defineStore('animationStore', () => {
  const state = reactive<AnimationStoreModel>({
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
    isCursorActivated: false,
    isMagneticHoverActivated: false,
    isScrollEnabled: true,
  });

  return {
    ...toRefs(state),
  };
});
