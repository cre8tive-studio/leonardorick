import { useDevicePixelRatio, useWindowSize } from '@vueuse/core';

const useSizes = () => {
  const { width, height } = useWindowSize();
  // const pixelRatio = computed(() => width.value / height.value);
  const { pixelRatio } = useDevicePixelRatio();
  return {
    width,
    height,
    pixelRatio,
  };
};

export default useSizes;
