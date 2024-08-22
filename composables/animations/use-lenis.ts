import Lenis from 'lenis';
interface ActivateOptions {
  raf?: boolean;
  scrollCallback?: (e: Lenis) => void;
}
const useLenis = () => {
  let lenis: Lenis;

  function rafCallback(time: number) {
    lenis.raf(time);
  }

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
  }

  return {
    activate,
    rafCallback,
  };
};

export default useLenis;
