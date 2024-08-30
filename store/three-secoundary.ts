import { Camera, Scene, WebGLRenderer } from 'three';

interface animationStoreModel {
  thisCamera: Camera | null;
  thisScene: Scene | null;
  thisRenderer: WebGLRenderer | null;
  isThreeSecondLayerActivated: boolean;
  shouldLoadThreeSecondary: boolean;
}

export const useThreeSecoundaryStore = defineStore('threeSecoundary', () => {
  const state = reactive<animationStoreModel>({
    thisCamera: null,
    thisScene: null,
    thisRenderer: null,
    isThreeSecondLayerActivated: false,
    shouldLoadThreeSecondary: false,
  });

  return {
    ...toRefs(state),
  };
});
