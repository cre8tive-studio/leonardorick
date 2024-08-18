import type { Fluid } from '~/components/FluidBackground/fluid';

interface animationStoreModel {
  isEnteringAnimationFinished: boolean;
  isLRModelLoaded: boolean;
  isOverlayCompleteHidden: boolean;
  loadingProgress: number;
  loadingTotal: number;
  fluid: Fluid | null;
  fluidCanvas: HTMLCanvasElement | undefined;
  logoCanvas: HTMLCanvasElement | undefined;
  scrollLayout: HTMLElement | undefined;
  loadingBarRef: HTMLDivElement | undefined;
  logoOverlayRef: HTMLDivElement | undefined;
  cubeLoaderContainerRef: HTMLDivElement | undefined;
}
export const useAnimationStore = defineStore('animationStore', () => {
  const state = reactive<animationStoreModel>({
    isEnteringAnimationFinished: false,
    isLRModelLoaded: false,
    isOverlayCompleteHidden: false,
    loadingProgress: 0,
    loadingTotal: 0,
    fluid: null,
    fluidCanvas: undefined,
    logoCanvas: undefined,
    scrollLayout: undefined,
    loadingBarRef: undefined,
    logoOverlayRef: undefined,
    cubeLoaderContainerRef: undefined,
  });

  const changeScrollLayoutOverflow = (overflow: '' | 'hidden') => {
    if (state.scrollLayout) {
      state.scrollLayout.style.overflow = overflow;
    }
  };

  return {
    ...toRefs(state),
    changeScrollLayoutOverflow,
  };
});
