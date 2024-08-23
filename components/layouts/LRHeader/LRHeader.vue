<template>
  <header class="c-Header">
    <template v-if="isXl">
      <LRHeaderNav class="text-right" />
    </template>
    <div
      v-else
      class="small-header"
    >
      <button
        class="circle-button burger-button cursor-pointer"
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

watch(isXl, () => {
  isMobileMenuVisible.value = false;
});

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
    z-index: 30;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;

    height: 55px;
    width: 55px;
    border-radius: 27.5px;
    background-color: $main-dark-text;

    span {
      // using border instead of height looked better
      // and more matching for both span sizes on the menu
      border: 2px solid $main-dark-bg;
      width: 40%;
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
