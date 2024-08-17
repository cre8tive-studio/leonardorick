import type { Fluid } from '~/components/FluidBackground/fluid';

interface animationStoreModel {
  isEnteringAnimationFinished: boolean;
  isLRModelLoaded: boolean;
  loadingProgress: number;
  loadingTotal: number;
  fluid: Fluid | null;
  fluidCanvas: HTMLCanvasElement | undefined;
  scrollLayout: HTMLElement | undefined;
}
export const useAnimationStore = defineStore('animationStore', () => {
  const state = reactive<animationStoreModel>({
    isEnteringAnimationFinished: false,
    isLRModelLoaded: false,
    loadingProgress: 0,
    loadingTotal: 0,
    fluid: null,
    fluidCanvas: undefined,
    scrollLayout: undefined,
  });

  return {
    ...toRefs(state),
  };
});
