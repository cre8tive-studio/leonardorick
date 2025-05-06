<template>
  <header
    class="c-LRHeader lr-section lr-safe-pointer-events-none l-default__header-container w-full flex fixed justify-end lg:justify-between"
  >
    <NuxtLink
      lr-magnetic-hover
      lr-cursor
      class="home-logo main-hover-button h-fit hidden lg:flex"
      :to="localeRoute('index')"
    >
      <SvgoLeonardorick />
    </NuxtLink>
    <div>
      <template v-if="isLg">
        <LRHeaderNav />
      </template>
      <div
        v-else
        class="small-header"
      >
        <button
          lr-cursor
          class="circle-button burger-button"
          @click="toggleMobileMenu"
        >
          <span />
          <span />
        </button>

        <div
          ref="mobileMenu"
          class="mobile-menu"
        >
          <LRHeaderNav @toggle-mobile-menu="toggleMobileMenu" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { timeline } from 'motion';
import type { TimelineDefinition } from 'motion';
import useCssBreakpoints from '~/composables/use-css-breakpoints';

import useHideOnScroll from '~/composables/animations/use-hide-on-scroll';
import { useAnimationStore } from '~/store/animation';
import { useAppStore } from '~/store';

const animationStore = useAnimationStore();
const { enableScroll, disableScroll } = animationStore;
const { isHideOnScrollBlocked } = toRefs(animationStore);

const { localeRoute } = toRefs(useAppStore());
const { isLg } = useCssBreakpoints();

const mobileMenu = ref<HTMLDivElement>();
const isMobileMenuVisible = ref(false);

const openSequence: TimelineDefinition = [
  ['.mobile-menu', { scaleY: [0, 1] }],
  ['.burger-button span', { rotate: 45 }, { at: '<' }],
];

const closeSequence: TimelineDefinition = [
  ['.mobile-menu', { scaleY: [1, 0] }],
  ['.burger-button span', { rotate: 0 }, { at: '<' }],
];

useHideOnScroll(['.c-LRHeader']);

watch(isLg, () => {
  isMobileMenuVisible.value = false;
});

function toggleMobileMenu() {
  isMobileMenuVisible.value = !isMobileMenuVisible.value;
  if (isMobileMenuVisible.value) {
    timeline(openSequence);
    disableScroll();
  } else {
    timeline(closeSequence);
    enableScroll();
  }

  isHideOnScrollBlocked.value = isMobileMenuVisible.value;
}
</script>

<style scoped lang="scss">
.c-LRHeader {
  $sm-header-height: 45px;
  @extend .lr-text--body-0-half;

  .home-logo {
    height: 7rem;
    width: 7rem;
    cursor: none;
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    svg {
      pointer-events: none; // for lr-cursor
      height: 3rem;
      width: 3rem;
      pointer-events: none;
    }
  }

  .circle-button {
    z-index: 30;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;

    height: $sm-header-height;
    width: $sm-header-height;
    border-radius: 27.5px;
    background-color: $main-dark-text;

    span {
      // using border instead of height looked better
      // and more matching for both span sizes on the menu
      border: 1px solid $main-dark-bg;
      width: 40%;
      background-color: $main-dark-bg;
      pointer-events: none; // for lr-cursor
    }
  }
  .close-button {
    color: $main-dark-bg;
  }
  .small-header {
    height: $sm-header-height;
  }

  .mobile-menu {
    background-color: $secondary-dark-bg;
    position: absolute;

    top: 0;
    left: 0;
    height: 100dvh;
    width: 100%;
    padding: 1rem;
    z-index: 20;

    // inital state to be animated from motion one
    transform: scaleY(0);
    transform-origin: top;
  }
  @media (min-width: $lg-breakpoint) {
    min-width: $sides-xl-width;
  }
}
</style>
