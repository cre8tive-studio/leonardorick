import Lenis from 'lenis';
interface ActivateOptions {
  raf?: boolean;
  scrollCallback?: (e: Lenis) => void;
}
const useLenis = (params?: ConstructorParameters<typeof Lenis>[0]) => {
  let lenis: Lenis;

  function rafCallback(time: number) {
    lenis.raf(time);
  }

  const activate = ({ raf = false, scrollCallback = () => {} }: ActivateOptions = {}) => {
    lenis = new Lenis(params);
    lenis.on('scroll', scrollCallback);

    if (raf) {
      function update(time: number) {
        rafCallback(time);
        requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    }
  };

  return {
    activate,
    rafCallback,
  };
};

export default useLenis;
