import Lenis from 'lenis';
import { useAnimationStore } from '~/store/animation';
interface ActivateOptions {
  raf?: boolean;
  onScroll?: (e: Lenis) => void;
}
const useLenis = () => {
  const { isScrollEnabled } = toRefs(useAnimationStore());
  const activated = ref(false);
  let lenis: Lenis;

  let thisOnScroll: (e: Lenis) => void = () => {};

  function activate({ raf = false, onScroll = () => {} }: ActivateOptions = {}) {
    lenis = new Lenis({ duration: 1.4 });
    thisOnScroll = onScroll;
    lenis.on('scroll', scrollCallback);
    handleScrollToggling();

    if (raf) {
      function update(time: number) {
        rafCallback(time);
        requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    }
    activated.value = true;
  }

  function scrollCallback(e: Lenis) {
    if (!activated.value) return;
    thisOnScroll(e);
    // ScrollTrigger.refresh(); // seems better off
  }

  function cleanup() {
    if (!activated.value || !lenis) return;
    lenis.off('scroll', scrollCallback);
  }

  function rafCallback(time: number) {
    if (!activated.value || !lenis) return;
    lenis.raf(time);
  }

  /**
   * private methods
   */
  function handleScrollToggling() {
    watch(isScrollEnabled, () => {
      const overflow = isScrollEnabled.value ? 'auto' : 'hidden';
      const method = isScrollEnabled.value ? 'start' : 'stop';

      document.body.style.overflowY = overflow;
      if (lenis) {
        lenis[method]();
      }
    });
  }

  return {
    activate,
    rafCallback,
    cleanup,
  };
};

export default useLenis;
