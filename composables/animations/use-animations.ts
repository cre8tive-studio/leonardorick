import gsap from 'gsap';
import { isWebglSupported } from '@leonardorick/three';
import useLenis from './use-lenis';
import useFluid from './use-fluid';
import useLeonardoRick from './use-leonardorick';
import useCursor from './use-cursor';
import useMagneticHover from './use-magnetic-hover';
import { useAnimationStore } from '~/store/animation';
import { setFPS, runWithControlledFPS } from '~/utils/run-with-controlled-fps';
import { COLORS } from '~/utils/constants/colors';

const LR_TIMEOUT_SECONDS = 10;

const useAnimations = () => {
  const route = useRoute();
  const isDebug = !!Object.prototype.hasOwnProperty.call(route.query, 'debug');
  const { isMobile } = useDevice();
  const {
    loadingBarRef,
    overlayRef,
    cubeLoaderContainerRef,
    isOverlayCompleteHidden,
    isLRModelLoaded,
    isLRModelTimedout,
    isScrollEnabled,
  } = toRefs(useAnimationStore());

  const lenis = useLenis();
  const fluid = useFluid();
  const leonardorick = useLeonardoRick();
  const cursor = useCursor();
  const magneticHover = useMagneticHover();
  const fluidFramersToSkipRef = { value: 0 };
  const isDocumentVisible = ref(true);

  async function activate() {
    const LRModelTimeout = setLRModelTimeout();

    useWhenReady(isLRModelLoaded, () => {
      clearTimeout(LRModelTimeout);
      hideOverlay();
    });

    if (!isWebglSupported()) {
      hideOverlay();
      console.warn('WebGL not supported so most animations will be disabled');
      return;
    }

    setupListeners();
    lenis.activate();
    await leonardorick.activate(isDebug);

    if (!isMobile) {
      cursor.activate();
      magneticHover.activate();
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
      lenis.rafCallback(time);
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
    window.addEventListener('beforeunload', beforeUnloadHandler);
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
    cursor.listeners.scroll(e);
  }

  function visibilityChangeHandler() {
    isDocumentVisible.value = document.visibilityState === 'visible';
  }

  function beforeUnloadHandler() {
    // setting html background avoid white flicker. Since reload removes
    // it after it's fine to leave it here, but, keep in mind that adding
    // html background will hide lodo and fluid
    const html = document.querySelector('html');
    if (html) {
      html.style.background = COLORS.mainDarkBg;
    }
  }

  function cleanup() {
    document.removeEventListener('visibilitychange', visibilityChangeHandler);
    document.removeEventListener('mousemove', mousemoveHandler);
    document.removeEventListener('pointerup', pointerupHandler);
    document.removeEventListener('pointerdown', pointerdownHandler);
    document.removeEventListener('keydown', keydownHandler);
    window.removeEventListener('scroll', scrollHandler);
    window.removeEventListener('beforeunload', beforeUnloadHandler);
    lenis.cleanup();
  }

  function hideOverlay() {
    isScrollEnabled.value = false;
    if (!overlayRef.value || !loadingBarRef.value || !cubeLoaderContainerRef.value) {
      isScrollEnabled.value = true;
      return;
    }

    if (route.path !== '/') {
      overlayRef.value.style.display = 'none';
    }

    const tl = gsap.timeline();
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
      .to(overlayRef.value, {
        duration: 2,
        opacity: 0,
        onStart: () => {
          // we only activate the fluid when the overlay is gone
          // so we can see the first color as the first colour is
          // possible to specify to be the same
          fluid.activate();
          isScrollEnabled.value = true;
        },
        onComplete: () => {
          if (overlayRef.value) {
            // Once the animation is complete, set the display to 'none'
            overlayRef.value.style.display = 'none';
            isOverlayCompleteHidden.value = true;
          }
        },
      });
  }

  function setLRModelTimeout() {
    return setTimeout(() => {
      isLRModelTimedout.value = true;
      // this will trigger the watch and handle hiding the overlay. if in the
      // future we need a different approach when timing out, might change the logic
      isLRModelLoaded.value = true;
      // eslint-disable-next-line no-console
      console.warn(`3D model was not loaded after ${LR_TIMEOUT_SECONDS}s`);
    }, LR_TIMEOUT_SECONDS * 1000);
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
    activate,
    cleanup,
  };
};

export default useAnimations;
