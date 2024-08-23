import { ScrollTrigger } from 'gsap/all';
import gsap from 'gsap';
import { isWebglSupported } from '@leonardorick/three';
import useLenis from './use-lenis';
import useFluid from './use-fluid';
import useLeonardoRick from './use-leonardorick';
import { useAnimationStore } from '~/store/animation';

interface runWithControlledFPSOptions {
  key?: 'default';
}

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
  const isDocumentVisible = ref(true);

  let fps = 60;
  const fpsController = {
    default: {
      TRESHOLD: 85,
      SKIP_FRAMES: 1,
      framesToSkip: 0,
    },
  };

  const LRModelTimeout = setLRModelTimeout();

  const unwatch = watch(isLRModelLoaded, () => {
    clearTimeout(LRModelTimeout);
    hideOverlay();
    unwatch();
  });

  document.addEventListener('visibilitychange', visibilityChangeHandler);

  onUnmounted(() => {
    document.removeEventListener('visibilitychange', visibilityChangeHandler);
  });

  function visibilityChangeHandler() {
    isDocumentVisible.value = document.visibilityState === 'visible';
  }

  async function activate() {
    gsap.registerPlugin(ScrollTrigger);

    if (!isWebglSupported()) {
      hideOverlay();
      // eslint-disable-next-line no-console
      console.warn('WebGL not supported so most animations will be disabled');
      return;
    }

    fluid.activate();
    await leonardorick.activate(isDebug);

    if (!isMobile) {
      lenis.activate();
    }

    requestAnimationFrame(update);

    function update(time: number) {
      if (!isDocumentVisible.value) {
        requestAnimationFrame(update);
        return;
      }

      setFPS(time);
      leonardorick.rafCallback();

      runWithController(() => lenis.rafCallback(time), { forbidden: isMobile });
      runWithController(() => runWithControlledFPS(() => fluid.rafCallback()), { forbidden: !document.hasFocus() });

      requestAnimationFrame(update);
    }
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

  const t: number[] = [];
  function setFPS(now: number) {
    t.unshift(now);
    if (t.length > 10) {
      const t0 = t.pop();
      fps = Math.floor((1000 * 10) / (now - (t0 || 0)));
    }
  }

  /**
   * used ro tun a functoin inside requestAnimationFrame blocking
   * some executions so it matches lower fps rates
   * @param cb function to run
   * @param options key of fpsControoller so we know the settings to  apply
   */
  function runWithControlledFPS(cb: (...args: any) => void, { key = 'default' }: runWithControlledFPSOptions = {}) {
    const controller = fpsController[key];

    if (controller.framesToSkip > 0) {
      controller.framesToSkip--;
      return;
    }
    if (fps > controller.TRESHOLD) {
      controller.framesToSkip = controller.SKIP_FRAMES;
    }

    cb();
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
  };
};

export default useAnimations;
