import { ScrollTrigger } from 'gsap/all';
import gsap from 'gsap';
import useLenis from './use-lenis';
import useFluid from './use-fluid';
import { useAnimationStore } from '~/store/animation';

const useAnimations = () => {
  const { scrollLayout } = toRefs(useAnimationStore());

  const lenis = useLenis({ wrapper: scrollLayout.value });
  const fluid = useFluid();

  gsap.registerPlugin(ScrollTrigger);

  const activate = () => {
    lenis.activate();
    fluid.activate();

    function update(time: number) {
      lenis.rafCallback(time);
      fluid.rafCallback();
      requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  };
  return {
    lenisActivate: lenis.activate,
    activate,
  };
};

export default useAnimations;
