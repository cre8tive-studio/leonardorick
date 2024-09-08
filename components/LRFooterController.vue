<template>
  <div
    ref="footerController"
    class="c-LRFooterController"
  />
</template>

<script setup lang="ts">
import { gsap } from 'gsap';

const footerController = ref<HTMLDivElement>();

onMounted(() => {
  const footer = document.querySelector('.c-LRFooter');
  const tl = gsap.timeline();
  const footerItems = document.querySelectorAll('.c-LRFooter li');

  tl.to(footer, {
    scrollTrigger: {
      trigger: '.c-LRFooterController',
      start: 'top+=25% bottom',
      end: 'bottom-=10% bottom',
      markers: true,
      scrub: true,
      onLeave: () => {
        document.querySelector('.c-LRFooter')?.setAttribute('activated', 'true');
        for (const li of footerItems) {
          li.setAttribute('lr-magnetic-hover', 'false');
        }
      },
      onEnterBack: () => {
        document.querySelector('.c-LRFooter')?.setAttribute('activated', 'false');
        for (const li of footerItems) {
          li.setAttribute('lr-magnetic-hover', 'true');
        }
      },
    },
    yoyo: true,
    scale: 1.2,
    marginBottom: '2rem',
  });

  tl.to('.c-LRFooter .left-spacer', {
    scrollTrigger: {
      trigger: '.c-LRFooterController',
      start: 'top+=25% bottom',
      end: 'bottom-=10% bottom',
      scrub: true,
    },
    width: '20vw',
  });

  if (footerController.value && footer) {
    footerController.value.style.height = getComputedStyle(footer).height;
    footerController.value.style.scale = '1.2';
  }
});
</script>
<style scoped lang="scss">
.c-LRFooterController {
  height: 30vh; // override on javascript
}
</style>
