import { useImagesStore } from '~/store/images';
import svg from '~/assets/icons/leonardorick.svg?raw';
import { COLORS } from '~/utils/constants/colors';

/**
 * System that caches the images and loads them
 * @returns
 */
const useCachedImage = () => {
  const { cacheImage, getCachedImage: getCachedImageFromStore } = useImagesStore();

  async function getCachedImage(id: string, url: string | undefined) {
    const image = getCachedImageFromStore(id);
    if (image) {
      return URL.createObjectURL(image);
    }

    if (url) {
      try {
        const data = await $fetch<Blob>(url);
        cacheImage(id, data);

        return URL.createObjectURL(data);
      } catch (e) {
        console.error(e);
        return placeHolderImage();
      }
    }
    return placeHolderImage();
  }

  function placeHolderImage() {
    const blob = new Blob([svg.replace(/currentColor/g, COLORS.mainDarkText)], { type: 'image/svg+xml' });
    return URL.createObjectURL(blob);
  }

  return {
    getCachedImage,
  };
};

export default useCachedImage;
