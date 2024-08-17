import { ScrollTrigger } from 'gsap/all';
import gsap from 'gsap';
import { isWebglSupported } from '@leonardorick/three';
import useLenis from './use-lenis';
import useFluid from './use-fluid';
import useLeonardoRick from './use-leonardorick';
import { useAnimationStore } from '~/store/animation';

const useAnimations = () => {
  const isDebug = !!Object.prototype.hasOwnProperty.call(useRoute().query, 'debug');

  const { scrollLayout } = toRefs(useAnimationStore());

  const lenis = useLenis({ wrapper: scrollLayout.value });
  const fluid = useFluid();
  const leonardorick = useLeonardoRick();

  gsap.registerPlugin(ScrollTrigger);

  const activate = async () => {
    if (!isWebglSupported()) {
      // eslint-disable-next-line no-console
      console.warn('WebGL not supported so animations will be disabled');
      return;
    }

    lenis.activate();
    fluid.activate();
    await leonardorick.activate(isDebug);
    requestAnimationFrame(update);

    function update(time: number) {
      lenis.rafCallback(time);
      fluid.rafCallback();
      leonardorick.rafCallback();
      requestAnimationFrame(update);
    }
  };

  return {
    lenisActivate: lenis.activate,
    activate,
  };
};

export default useAnimations;
