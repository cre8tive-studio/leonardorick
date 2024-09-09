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

onMounted(() => {
  const footer = document.querySelector('.c-LRFooter');
  const footerItems = document.querySelectorAll('.c-LRFooter li');

  tl = gsap.timeline({
    scrollTrigger: {
      id: SCROLL_TRIGGER_IDS.FOOTER,
      trigger: '.c-LRFooterController',
      start: 'top+=25% bottom',
      end: 'bottom-=10% bottom',
      scrub: true,
      onLeave: () => {
        footer?.setAttribute('activated', 'true');
        for (const li of footerItems || []) {
          li.setAttribute('lr-magnetic-hover', 'false');
        }
      },
      onEnterBack: () => {
        footer?.setAttribute('activated', 'false');
        for (const li of footerItems || []) {
          li.setAttribute('lr-magnetic-hover', 'true');
        }
      },
    },
  });

  tl.to(footer, {
    yoyo: true,
    scale: 1.2,
    marginBottom: '2rem',
  });

  tl.to(
    '.c-LRFooter .left-spacer',
    {
      width: '20vw',
    },
    '<'
  );

  if (footerController.value && footer) {
    footerController.value.style.height = getComputedStyle(footer).height;
    footerController.value.style.scale = '1.2';
  }
});

onUnmounted(() => {
  tl?.kill();
  ScrollTrigger.getById(SCROLL_TRIGGER_IDS.FOOTER)?.kill(true);
});
</script>
<style scoped lang="scss">
.c-LRFooterController {
  height: 30vh; // override on javascript
}
</style>
