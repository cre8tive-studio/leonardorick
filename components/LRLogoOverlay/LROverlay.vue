<template>
  <div
    id="overlay"
    ref="overlay"
    aria-hidden="true"
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
const { loadingBarRef, overlayRef, cubeLoaderContainerRef, loadingProgress, loadingTotal } = toRefs(
  useAnimationStore()
);
const overlay = ref();
const loadingBarComponent = ref();
const cubeLoaderContainer = ref();
onMounted(() => {
  loadingBarRef.value = loadingBarComponent.value.loadingBar;
  overlayRef.value = overlay.value;
  cubeLoaderContainerRef.value = cubeLoaderContainer.value;
});
</script>

<style scoped lang="scss">
#overlay {
  z-index: 50;
  top: 0;
  left: 0;
  background-color: $main-dark-bg;
}
</style>
