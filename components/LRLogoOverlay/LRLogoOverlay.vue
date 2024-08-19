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
    <div
      ref="cubeLoaderContainer"
      class="h-full w-full flex justify-center items-center"
    >
      <LRCubeLoader />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAnimationStore } from '~/store/animation';
/**
 * ~ loading
 */
const { loadingBarRef, logoOverlayRef, cubeLoaderContainerRef, loadingProgress, loadingTotal } = toRefs(
  useAnimationStore()
);
const logoOverlay = ref();
const loadingBarComponent = ref();
const cubeLoaderContainer = ref();
onMounted(() => {
  loadingBarRef.value = loadingBarComponent.value.loadingBar;
  logoOverlayRef.value = logoOverlay.value;
  cubeLoaderContainerRef.value = cubeLoaderContainer.value;
});
</script>

<style scoped lang="scss">
#logoOverlay {
  z-index: 50;
  top: 0;
  left: 0;
  background-color: $main-dark-bg;
}
</style>
