<template>
  <div
    id="logoOverlay"
    ref="logoOverlay"
    class="fixed h-full w-full"
  >
    <LoadingBar
      ref="loadingBarComponent"
      :progress="loadingProgress"
      :total="loadingTotal"
    />
  </div>
  <FluidBackground />
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import useAnimations from '~/composables/animations/use-animations';
import { useAnimationStore } from '~/store/animation';
/**
 * ~ loading
 */
const logoOverlay = ref();
const loadingBarComponent = ref();

const { activate } = useAnimations();
const { isLRModelLoaded, loadingProgress, loadingTotal } = toRefs(useAnimationStore());

onMounted(async () => {
  const unwatch = watch(isLRModelLoaded, () => {
    hideOverlay();
    unwatch();
  });
  await activate();
});

function hideOverlay() {
  const tl = gsap.timeline();
  tl.to(loadingBarComponent.value.loadingBar, {
    delay: 0.5,
    duration: 0.3,
    opacity: 0,
  }).to(logoOverlay.value, {
    duration: 3,
    opacity: 0,
    onComplete: () => {
      if (logoOverlay.value) {
        // Once the animation is complete, set the display to 'none'
        logoOverlay.value.style.display = 'none';
      }
    },
  });
}
</script>

<style scoped lang="scss">
#logoOverlay {
  z-index: 1;
  top: 0;
  left: 0;
  background-color: $main-dark-bg;
}
</style>
