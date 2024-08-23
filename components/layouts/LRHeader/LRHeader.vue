<template>
  <header class="c-Header">
    <div
      v-if="isXl"
      class="flex"
    >
      <LRHeaderNav class="text-right" />
    </div>
    <div
      v-else
      class="small-header flex"
    >
      <button
        class="circle-button burger-button flex flex-col items-center justify-center gap-1 cursor-pointer"
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
import { timeline } from 'motion';
import type { TimelineDefinition } from 'motion';
import useCssBreakpoints from '~/composables/use-css-breakpoints';
const mobileMenu = ref<HTMLDivElement>();
const isMobileMenuVisible = ref(false);
const { isXl } = useCssBreakpoints();

const openSequence: TimelineDefinition = [
  ['.mobile-menu', { scaleY: [0, 1] }],
  ['.burger-button span', { rotate: 45 }, { at: '<' }],
];

const closeSequence: TimelineDefinition = [
  ['.mobile-menu', { scaleY: [1, 0] }],
  ['.burger-button span', { rotate: 0 }, { at: '<' }],
];

function toggleMobileMenu() {
  isMobileMenuVisible.value = !isMobileMenuVisible.value;
  isMobileMenuVisible.value ? timeline(openSequence) : timeline(closeSequence);
}
</script>

<style scoped lang="scss">
.c-Header {
  .circle-button {
    height: 55px;
    width: 55px;
    border-radius: 52px;
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
    padding: 1rem;
    z-index: 20;

    // inital state to be animated from motion one
    transform: scaleY(0);
    transform-origin: top;
  }
  @media (min-width: $xl-breakpoint) {
    min-width: $sides-xl-width;
  }
}
</style>
