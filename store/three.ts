import type { Fluid } from '~/components/FluidBackground/fluid';

interface ThreeStoreModel {
  isEnteringAnimationFinished: boolean;
  fluid: Fluid | null;
  fluidCanvas: HTMLCanvasElement | null;
}
export const useThreeStore = defineStore('threeStore', () => {
  const state = reactive<ThreeStoreModel>({
    isEnteringAnimationFinished: false,
    fluid: null,
    fluidCanvas: null,
  });

  function fluidExplosion() {
    if (state.fluid && state.fluidCanvas) {
      const { multipleSplats, getRandomMultipleSplatsArgs } = state.fluid;
      if (multipleSplats && getRandomMultipleSplatsArgs) {
        const middleX = state.fluidCanvas.clientWidth / 2;
        const middleY = state.fluidCanvas.clientHeight / 2;
        multipleSplats({
          ...getRandomMultipleSplatsArgs(),
          sizeX: 1000,
          sizeY: 500,
          x: middleX - 350,
          y: middleY - 350,
        });

        setTimeout(() => {
          multipleSplats({
            ...getRandomMultipleSplatsArgs(),
            sizeX: 1000,
            sizeY: 500,
            x: middleX - 300,
            y: middleY - 150,
          });
        }, 70);

        setTimeout(() => {
          multipleSplats({
            ...getRandomMultipleSplatsArgs(),
            sizeX: 1000,
            sizeY: 500,
            x: middleX - 50,
            y: middleY - 300,
          });
        }, 140);

        setTimeout(() => {
          multipleSplats({
            ...getRandomMultipleSplatsArgs(),
            sizeX: 1000,
            sizeY: 500,
            x: middleX - 250,
            y: middleY + 50,
          });
        }, 210);
      }
    }
  }

  return {
    ...toRefs(state),
    fluidExplosion,
  };
});
