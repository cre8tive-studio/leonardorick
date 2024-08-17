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
import useAnimations from '~/composables/animations/use-animations';
import { useAnimationStore } from '~/store/animation';
/**
 * ~ loading
 */
const logoOverlay = ref();
const loadingBarComponent = ref();

const { activate } = useAnimations();
const { loadingBarRef, logoOverlayRef, loadingProgress, loadingTotal } = toRefs(useAnimationStore());

onMounted(async () => {
  loadingBarRef.value = loadingBarComponent.value.loadingBar;
  logoOverlayRef.value = logoOverlay.value;
  await activate();
});
</script>

<style scoped lang="scss">
#logoOverlay {
  z-index: 1;
  top: 0;
  left: 0;
  background-color: $main-dark-bg;
}
</style>
