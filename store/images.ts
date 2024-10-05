interface AnimationStoreModel {
  [id: string]: string;
}

export const useImagesStore = defineStore('imagesStore', () => {
  const state = reactive<AnimationStoreModel>({});

  function cacheImage(id: string, localUrl: string) {
    state[id] = localUrl;
  }

  function getCachedImage(id: string) {
    return state[id];
  }
  return {
    getCachedImage,
    cacheImage,
  };
});
