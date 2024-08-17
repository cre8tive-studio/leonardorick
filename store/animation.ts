import type { Fluid } from '~/components/FluidBackground/fluid';

interface animationStoreModel {
  isEnteringAnimationFinished: boolean;
  fluid: Fluid | null;
  fluidCanvas: HTMLCanvasElement | undefined;
  scrollLayout: HTMLElement | undefined;
}
export const useAnimationStore = defineStore('animationStore', () => {
  const state = reactive<animationStoreModel>({
    isEnteringAnimationFinished: false,
    fluid: null,
    fluidCanvas: undefined,
    scrollLayout: undefined,
  });

  return {
    ...toRefs(state),
  };
});
