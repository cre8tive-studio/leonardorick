import { ScrollTrigger } from 'gsap/all';
import gsap from 'gsap';
import { isWebglSupported } from '@leonardorick/three';
import useLenis from './use-lenis';
import useFluid from './use-fluid';
import useLeonardoRick from './use-leonardorick';
import useCursor from './use-cursor';
import useMagneticHover from './use-magnetic-hover';
import { useAnimationStore } from '~/store/animation';
import { setFPS, runWithControlledFPS } from '~/utils/run-with-controlled-fps';

const useAnimations = () => {
  const isDebug = !!Object.prototype.hasOwnProperty.call(useRoute().query, 'debug');
  const { isMobile } = useDevice();
  const {
    loadingBarRef,
    logoOverlayRef,
    cubeLoaderContainerRef,
    isOverlayCompleteHidden,
    isLRModelLoaded,
    isLRModelTimedout,
  } = toRefs(useAnimationStore());
  const lenis = useLenis();
  const fluid = useFluid();
  const leonardorick = useLeonardoRick();
  const cursor = useCursor();
  const magneticHover = useMagneticHover();
  const fluidFramersToSkipRef = { value: 0 };
  const isDocumentVisible = ref(true);

  const LRModelTimeout = setLRModelTimeout();

  const unwatch = watch(isLRModelLoaded, () => {
    clearTimeout(LRModelTimeout);
    hideOverlay();
    unwatch();
  });

  async function activate() {
    gsap.registerPlugin(ScrollTrigger);

    if (!isWebglSupported()) {
      hideOverlay();
      // eslint-disable-next-line no-console
      console.warn('WebGL not supported so most animations will be disabled');
      return;
    }

    setupListeners();

    fluid.activate();
    await leonardorick.activate(isDebug);

    if (!isMobile) {
      cursor.activate();
      magneticHover.activate();
      lenis.activate();
    }

    requestAnimationFrame(update);

    function update(time: number) {
      if (!isDocumentVisible.value) {
        requestAnimationFrame(update);
        return;
      }
      setFPS(time);

      cursor.rafCallback();
      magneticHover.rafCallback();
      leonardorick.rafCallback();
      runWithController(() => lenis.rafCallback(time), { forbidden: isMobile });
      runWithController(() => runWithControlledFPS(() => fluid.rafCallback(), fluidFramersToSkipRef), {
        forbidden: !document.hasFocus(),
      });

      requestAnimationFrame(update);
    }
  }

  function setupListeners() {
    document.addEventListener('visibilitychange', visibilityChangeHandler);
    document.addEventListener('mousemove', mousemoveHandler);
    document.addEventListener('pointerup', pointerupHandler);
    document.addEventListener('pointerdown', pointerdownHandler);
    document.addEventListener('keydown', keydownHandler);
    window.addEventListener('scroll', scrollHandler);
  }

  function mousemoveHandler(e: MouseEvent) {
    leonardorick.listeners.mousemove(e);
    cursor.listeners.mousemove(e);
    fluid.listeners.mousemove(e);
  }

  function pointerupHandler(e: PointerEvent) {
    cursor.listeners.pointerup(e);
    fluid.listeners.pointerup(e);
  }

  function pointerdownHandler(e: PointerEvent) {
    cursor.listeners.pointerdown(e);
    fluid.listeners.pointerdown(e);
  }

  function keydownHandler(e: KeyboardEvent) {
    fluid.listeners.keydown(e);
  }

  function scrollHandler(e: Event) {
    if (!shouldLoadThreeSecondary.value && window.scrollY > THREE_SECOND_LAYER_ACTIVATE_SCROLL_POSITION) {
      shouldLoadThreeSecondary.value = true;
    }
    cursor.listeners.scroll(e);
  }

  function cleanup() {
    document.removeEventListener('visibilitychange', visibilityChangeHandler);
    document.removeEventListener('mousemove', mousemoveHandler);
    document.removeEventListener('pointerup', pointerupHandler);
    document.removeEventListener('pointerdown', pointerdownHandler);
    document.removeEventListener('keydown', keydownHandler);
    window.removeEventListener('scroll', scrollHandler);
  }

  function visibilityChangeHandler() {
    isDocumentVisible.value = document.visibilityState === 'visible';
  }

  function hideOverlay() {
    const tl = gsap.timeline();
    if (logoOverlayRef.value && loadingBarRef.value && cubeLoaderContainerRef.value) {
      // hide only topbar first
      tl.to(loadingBarRef.value, {
        delay: 0.5,
        duration: 0.3,
        opacity: 0,
      })
        // hide cube loader
        .to(cubeLoaderContainerRef.value, {
          duration: 0.3,
          opacity: 0,
        })
        // hide overlay completly
        .to(logoOverlayRef.value, {
          duration: 2,
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
  function setLRModelTimeout() {
    return setTimeout(() => {
      isLRModelTimedout.value = true;
      // this will trigger the watch and handle hiding the overlay. if in the
      // future we need a different approach when timing out, might change the logic
      isLRModelLoaded.value = true;
      // eslint-disable-next-line no-console
      console.warn('3D model was not loaded after 10s');
    }, 10000);
  }

  /**
   * used to run a function inside requestAnimationFrame behind some condition
   * @param cb
   * @param param1
   */
  function runWithController(cb: (...args: any) => void, { forbidden = true } = {}) {
    if (!forbidden) {
      cb();
    }
  }

  return {
    lenisActivate: lenis.activate,
    activate,
    cleanup,
  };
};

export default useAnimations;
