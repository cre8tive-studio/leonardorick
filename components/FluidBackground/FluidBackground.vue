<template>
  <canvas
    id="fluidCanvas"
    ref="fluidCanvasRef"
    aria-hidden="true"
  />
</template>
<script setup lang="ts">
import { useAnimationStore } from '~/store/animation';
const { fluidCanvas } = toRefs(useAnimationStore());

const fluidCanvasRef = ref();
onMounted(() => {
  fluidCanvas.value = fluidCanvasRef.value;
});
</script>
<style scoped lang="scss">
canvas {
  width: 100%;
  height: 100svh;
  background-color: transparent;
  position: fixed;
  z-index: -40;
}
</style>
