import svg from '~/assets/icons/leonardorick.svg?raw';
import { COLORS } from '~/utils/constants/colors';

/**
 * System that caches the images and loads them
 * @returns
 */
const useCachedImage = () => {
  const { getCachedFile } = useCachedFile();

  async function getCachedImage(fileId: string, url: string | undefined) {
    try {
      const blob = await getCachedFile({ fileId, url });
      return URL.createObjectURL(blob);
    } catch (e) {
      console.error(e);
      return placeHolderImage();
    }
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
