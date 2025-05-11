import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useAnimationStore } from '~/store/animation';

/**
 * used to hide some header, footer or any side
 * information while the user is scrolling
 */
const useHideOnScroll = (classes: string[]) => {
  if (import.meta.server) {
    return;
  }

  const { isHideOnScrollBlocked } = toRefs(useAnimationStore());
  const toBlockHeight = ref(0);
  const blocked = ref(false);
  const route = useRoute();

  let onScrollTrigger: ScrollTrigger;
  let forceHideTrigger: ScrollTrigger;
  let endOfPageTrigger: ScrollTrigger;
  let direction = 0;
  let isFirstScroll = true;
  let timeout: NodeJS.Timeout;
  let height = 0;

  const observer = new ResizeObserver((entries) => {
    const heightChangedEntry = entries.find((entry) => Math.round(entry.contentRect.height) !== height);

    if (!heightChangedEntry) return;
    height = Math.round(heightChangedEntry.contentRect.height);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      resetEverything();
      activate();
      setEndOfPageTrigger();
    }, 500);
  });

  onMounted(() => observer.observe(document.body));

  onUnmounted(() => {
    resetEverything();
    observer.disconnect();
  });

  function activate() {
    gsap.to(classes, { autoAlpha: getScrollHeight() > 0 ? 0 : 1 });
    onScrollTrigger = ScrollTrigger.create({
      onUpdate: (self) => {
        if (self.direction !== direction) {
          direction = self.direction;
          animate();
        }
      },
    });

    forceHideTrigger = ScrollTrigger.create({
      start: () => window.innerHeight,
      onEnter: () => {
        animate();
        forceHideTrigger.kill();
      },
    });
  }

  function resetEverything() {
    isFirstScroll = true;
    onScrollTrigger?.kill(true);
    forceHideTrigger?.kill(true);
    endOfPageTrigger?.kill(true);
  }

  watch(blocked, () => animate());

  watch(
    () => route.path,
    () => setEndOfPageTrigger()
  );

  function animate() {
    gsap.to(classes, {
      autoAlpha: direction === 1 && !isFirstScroll && !blocked.value && !isHideOnScrollBlocked.value ? 0 : 1,
    });
    isFirstScroll = false;
  }

  function setEndOfPageTrigger() {
    if (route.path !== '/') {
      return;
    }

    // basically we aalways show everything, and block the opacity 0 when we are reaching the end of the page.
    // The end of the page is the scrollheight minus the size of the viewport, which tries to aproximate that
    // we are reaching the end of the page.
    const scrollHeight = getScrollHeight();
    toBlockHeight.value = scrollHeight - window.screen.height * 1.1;

    blocked.value = false;
    endOfPageTrigger?.kill(true);
    endOfPageTrigger = ScrollTrigger.create({
      start: () => toBlockHeight.value,
      onEnter: () => {
        blocked.value = true;
      },

      onLeaveBack: () => {
        blocked.value = false;
      },
    });
  }

  function getScrollHeight() {
    return document.body.offsetHeight - window.innerHeight;
  }
};

export default useHideOnScroll;
