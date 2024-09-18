import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useAppStore } from '~/store';
import { useAnimationStore } from '~/store/animation';

const useHideOnScroll = (classes: string[]) => {
  const { isHideOnScrollBlocked } = toRefs(useAnimationStore());
  const toBlockHeight = ref(0);
  const blocked = ref(false);
  const route = useRoute();
  const { loaded } = toRefs(useAppStore());

  let onScrollTrigger: ScrollTrigger;
  let forceHideTrigger: ScrollTrigger;
  let endOfPageTrigger: ScrollTrigger;
  let direction = 0;
  let isFirstScroll = true;

  onMounted(() => {
    gsap.to(classes, { autoAlpha: 0 });
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
  });

  function setEndOfPageTrigger() {
    // basically we aalways show everything, and block the opacity 0 when we are reaching the end of the page.
    // The end of the page is the scrollheight minus the size of the viewport, which tries to aproximate that
    // we are reaching the end of the page.
    const scrollHeight = document.body.offsetHeight - window.innerHeight;
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

  const unwatch = watch(loaded, () => {
    if (!loaded.value) return;
    setTimeout(() => setEndOfPageTrigger(), 0);
    unwatch();
  });

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

  onUnmounted(() => {
    onScrollTrigger?.kill(true);
    forceHideTrigger?.kill(true);
    endOfPageTrigger?.kill(true);
  });
};

export default useHideOnScroll;
