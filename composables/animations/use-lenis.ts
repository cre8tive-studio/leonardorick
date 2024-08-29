import Lenis from 'lenis';
interface ActivateOptions {
  raf?: boolean;
  onScroll?: (e: Lenis) => void;
}
const useLenis = () => {
  const activated = ref(false);
  let lenis: Lenis;
  let thisOnScroll: (e: Lenis) => void = () => {};

  function activate({ raf = false, onScroll = () => {} }: ActivateOptions = {}) {
    lenis = new Lenis({ duration: 1.4 });
    thisOnScroll = onScroll;
    lenis.on('scroll', scrollCallback);

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
    if (!activated.value) return;
    lenis.off('scroll', scrollCallback);
  }

  function rafCallback(time: number) {
    if (!activated.value) return;
    lenis.raf(time);
  }

  return {
    activate,
    rafCallback,
    cleanup,
  };
};

export default useLenis;
