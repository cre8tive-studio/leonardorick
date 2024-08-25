import { Fluid } from '~/components/FluidBackground/fluid.js';
import { useAnimationStore } from '~/store/animation';

const useFluid = () => {
  const { fluid, fluidCanvas } = toRefs(useAnimationStore());
  const activated = ref(false);

  function rafCallback() {
    if (!fluid.value?.rafCallback || !activated.value) {
      return;
    }

    fluid.value.rafCallback();
  }

  function activate() {
    fluid.value = new Fluid(fluidCanvas.value, { initialColor: { r: 0, g: 246 / 255, b: 1 }, addListeners: false });
    fluid.value.mapBehaviors({
      sim_resolution: 128,
      dye_resolution: 512,

      paused: false,
      embedded_dither: true,

      dissipation: 0.97,
      velocity: 0.98,
      pressure: 0.8,
      pressure_iteration: 20,
      curl: 0,
      emitter_size: 0.5,

      render_shaders: true,

      multi_color: false,

      render_bloom: false,
      bloom_iterations: 8,
      bloom_resolution: 256,
      intensity: 0.8,
      threshold: 0.6,
      soft_knee: 0.7,

      background_color: { r: 15, g: 15, b: 15 },
      transparent: true,
      saturation: 1,
      brightness: 1,
      effect_trigger: 'hover',
      rgb: {
        multiplier: [0.15, 0.15, 0.15],
        adder: [-0.1, 0, 0.4],
      },
    });
    const res = fluid.value.activate();
    const { multipleSplats, getRandomMultipleSplatsArgs } = res;
    multipleSplats(getRandomMultipleSplatsArgs());
    activated.value = true;
  }

  function fluidExplosion() {
    if (fluid.value) {
      const { multipleSplats, getRandomMultipleSplatsArgs } = fluid.value;
      if (multipleSplats && getRandomMultipleSplatsArgs && fluidCanvas.value) {
        const middleX = fluidCanvas.value.clientWidth / 2;
        const middleY = fluidCanvas.value.clientHeight / 2;
        const timeout = 75;
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
        }, timeout);

        setTimeout(() => {
          multipleSplats({
            ...getRandomMultipleSplatsArgs(),
            sizeX: 1000,
            sizeY: 500,
            x: middleX - 50,
            y: middleY - 300,
          });
        }, timeout * 2);

        setTimeout(() => {
          multipleSplats({
            ...getRandomMultipleSplatsArgs(),
            sizeX: 1000,
            sizeY: 500,
            x: middleX - 250,
            y: middleY + 50,
          });
        }, timeout * 3);
      }
    }
  }

  function mousemoveHandler(e: MouseEvent) {
    fluid.value?.listeners?.mousemove(e);
  }

  function pointerupHandler(e: PointerEvent) {
    fluid.value?.listeners?.pointerup(e);
  }

  function pointerdownHandler(e: PointerEvent) {
    fluid.value?.listeners?.pointerdown(e);
  }

  function keydownHandler(e: KeyboardEvent) {
    fluid.value?.listeners?.keydown(e);
  }

  return {
    fluidExplosion,
    activate,
    rafCallback,
    listeners: {
      mousemove: mousemoveHandler,
      pointerup: pointerupHandler,
      pointerdown: pointerdownHandler,
      keydown: keydownHandler,
    },
  };
};
export default useFluid;
