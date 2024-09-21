interface AnimationStoreModel {
  [id: string]: Blob;
}

export const useImagesStore = defineStore('imagesStore', () => {
  const state = reactive<AnimationStoreModel>({});

  function cacheImage(id: string, blob: Blob) {
    state[id] = blob;
  }

  function getCachedImage(id: string) {
    return state[id];
  }
  return {
    getCachedImage,
    cacheImage,
  };
});
