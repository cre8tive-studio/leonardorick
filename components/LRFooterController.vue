<template>
  <div
    ref="footerController"
    class="c-LRFooterController"
  />
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { SCROLL_TRIGGER_IDS } from '~/utils/constants/scroll-trigger-ids';
const footerController = ref<HTMLDivElement>();

let tl: GSAPTimeline | null;
let footer: HTMLDivElement | null;
let footerItems: HTMLLIElement[] | null;
const footerSpacerSelector = '.c-LRFooter .left-spacer';

onMounted(() => {
  footer = document.querySelector('.c-LRFooter') as HTMLDivElement;
  footerItems = Array.from(document.querySelectorAll('.c-LRFooter li')) as HTMLLIElement[];

  tl = gsap.timeline({
    scrollTrigger: {
      id: SCROLL_TRIGGER_IDS.FOOTER,
      trigger: '.c-LRFooterController',
      start: 'top+=25% bottom',
      end: 'bottom-=15% bottom',
      scrub: true,
      onLeave: () => {
        footer?.setAttribute('activated', 'true');
        for (const li of footerItems || []) {
          li.setAttribute('lr-magnetic-hover', 'false');
          li.setAttribute('lr-cursor', 'false');
        }
      },
      onEnterBack: () => hideFooter(),
    },
  });

  tl.fromTo(
    footer,
    {
      scale: 1,
      marginBottom: '0rem',
    },
    {
      yoyo: true,
      scale: 1.2,
      marginBottom: '2.5rem',
    }
  );

  tl.fromTo(
    footerSpacerSelector,
    {
      width: '0vw',
    },
    {
      width: '20vw',
    },
    '<'
  );

  if (footerController.value && footer) {
    footerController.value.style.height = getComputedStyle(footer).height;
    footerController.value.style.transform = 'scaleY(1.2)';
  }
});

function hideFooter() {
  if (!footer || !footerItems || !footerItems.length) return;
  footer.setAttribute('activated', 'false');
  for (const li of footerItems) {
    li.setAttribute('lr-magnetic-hover', 'true');
    li.setAttribute('lr-cursor', 'true');
  }
}

function animateOut() {
  hideFooter();
  const tl = gsap.timeline();
  tl.to(footer, { scale: 1, marginBottom: '0rem' });
  tl.to(footerSpacerSelector, { width: 0 }, '<');
}

onUnmounted(() => {
  animateOut();
  tl?.kill();
  ScrollTrigger.getById(SCROLL_TRIGGER_IDS.FOOTER)?.kill(true);
});
</script>
<style scoped lang="scss">
.c-LRFooterController {
  height: 30vh; // override on javascript
}
</style>
