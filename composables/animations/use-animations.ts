import { ScrollTrigger } from 'gsap/all';
import gsap from 'gsap';
import { isWebglSupported } from '@leonardorick/three';
import useLenis from './use-lenis';
import useFluid from './use-fluid';
import useLeonardoRick from './use-leonardorick';
import { useAnimationStore } from '~/store/animation';

const useAnimations = () => {
  const isDebug = !!Object.prototype.hasOwnProperty.call(useRoute().query, 'debug');

  const { scrollLayout, loadingBarRef, logoOverlayRef, isOverlayCompleteHidden, isLRModelLoaded } = toRefs(
    useAnimationStore()
  );
  const lenis = useLenis({ wrapper: scrollLayout.value });
  const fluid = useFluid();
  const leonardorick = useLeonardoRick();

  gsap.registerPlugin(ScrollTrigger);

  const unwatch = watch(isLRModelLoaded, () => {
    hideOverlay();
    unwatch();
  });

  const activate = async () => {
    if (!isWebglSupported()) {
      hideOverlay();
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

  function hideOverlay() {
    const tl = gsap.timeline();
    if (logoOverlayRef.value && loadingBarRef.value) {
      tl.to(loadingBarRef.value, {
        delay: 0.5,
        duration: 0.3,
        opacity: 0,
      }).to(logoOverlayRef.value, {
        duration: 3,
        opacity: 0,
        onComplete: () => {
          if (logoOverlayRef.value) {
            // Once the animation is complete, set the display to 'none'
            logoOverlayRef.value.style.display = 'none';
            isOverlayCompleteHidden.value = true;
          }
        },
      });
    }
  }

  return {
    lenisActivate: lenis.activate,
    activate,
  };
};

export default useAnimations;
