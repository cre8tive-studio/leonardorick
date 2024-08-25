import Lenis from 'lenis';
interface ActivateOptions {
  raf?: boolean;
  scrollCallback?: (e: Lenis) => void;
}
const useLenis = () => {
  let lenis: Lenis;
  const activated = ref(false);

  function activate({ raf = false, scrollCallback = () => {} }: ActivateOptions = {}) {
    lenis = new Lenis({ duration: 1.4 });
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

  function rafCallback(time: number) {
    if (!activated.value) return;
    lenis.raf(time);
  }

  return {
    activate,
    rafCallback,
  };
};

export default useLenis;
