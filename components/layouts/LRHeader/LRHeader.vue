<template>
  <header class="c-Header">
    <div class="hidden xl:flex">
      <LRHeaderNav class="text-right" />
    </div>
    <div class="small-header flex xl:hidden">
      <button
        class="circle-button burger-button"
        @click="toggleMobileMenu"
      >
        <span />
        <span />
      </button>

      <div
        ref="mobileMenu"
        class="c-Header mobile-menu w-full h-full flex flex-col gap-4"
      >
        <LRHeaderNav @route-selected="toggleMobileMenu" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';

const mobileMenu = ref<HTMLDivElement>();
const isTimelineDefined = ref(false);
const isMobileMenuVisible = ref(false);

const tl = gsap.timeline({
  paused: true,
  defaults: { duration: 0.5 },
});

onMounted(() => {
  defineTimeline();
});

function defineTimeline() {
  if (!mobileMenu.value) {
    return;
  }

  tl.from(mobileMenu.value, { scaleY: 0, ease: 'none', transformOrigin: 'top' }, '<');
  tl.to(mobileMenu.value, { scaleY: 1, ease: 'none', transformOrigin: 'top' }, '<');
  tl.to('.burger-button span', { rotation: 45 }, '<');
  isTimelineDefined.value = true;
}

function toggleMobileMenu() {
  isMobileMenuVisible.value = !isMobileMenuVisible.value;
  isMobileMenuVisible.value ? tl.play() : tl.reverse();
}
</script>

<style scoped lang="scss">
.c-Header {
  .circle-button {
    display: flex;
    gap: 4px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 55px;
    width: 55px;
    border-radius: 52px;
    cursor: pointer;
    background-color: $main-dark-text;
  }

  .burger-button {
    z-index: 30;
    span {
      height: 2px;
      width: 30%;
      background-color: $main-dark-bg;
    }
  }
  .close-button {
    color: $main-dark-bg;
  }
  .small-header {
    height: $sm-header-height;
  }

  .mobile-menu {
    background-color: $secoundary-dark-bg;
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    padding: 16px;
    z-index: 20;
  }
  @media (min-width: $xl-breakpoint) {
    min-width: $sides-xl-width;
  }
}
</style>
