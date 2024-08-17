import { ScrollTrigger } from 'gsap/all';
import gsap from 'gsap';
import { isWebglSupported } from '@leonardorick/three';
import useLenis from './use-lenis';
import useFluid from './use-fluid';
import { useAnimationStore } from '~/store/animation';

const useAnimations = () => {
  const { scrollLayout } = toRefs(useAnimationStore());

  const lenis = useLenis({ wrapper: scrollLayout.value });
  const fluid = useFluid();

  gsap.registerPlugin(ScrollTrigger);

  const activate = () => {
    if (!isWebglSupported()) {
      // eslint-disable-next-line no-console
      console.warn('WebGL not supported so animations will be disabled');
      return;
    }

    lenis.activate();
    fluid.activate();
    requestAnimationFrame(update);

    function update(time: number) {
      lenis.rafCallback(time);
      fluid.rafCallback();
      requestAnimationFrame(update);
    }
  };
  return {
    lenisActivate: lenis.activate,
    activate,
  };
};

export default useAnimations;
