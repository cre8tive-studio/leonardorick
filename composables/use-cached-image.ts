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
    const localUrl = getCachedImageFromStore(id);
    if (localUrl) {
      return localUrl;
    }

    if (url) {
      try {
        const blob = await $fetch<Blob>(url);
        const data = URL.createObjectURL(blob);
        cacheImage(id, data);

        return data;
      } catch (e) {
        // eslint-disable-next-line no-console
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
