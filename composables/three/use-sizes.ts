import { useWindowSize } from '@vueuse/core';

const useSizes = () => {
  const { width, height } = useWindowSize();
  // probably not needed (window.devicePixelRatio)
  // const pixelRatio = computed(() => width.value / height.value);
  return {
    width,
    height,
  };
};

export default useSizes;
