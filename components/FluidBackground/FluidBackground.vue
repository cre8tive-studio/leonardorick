<template>
  <canvas
    id="fluidCanvas"
    ref="fluidCanvasRef"
  ></canvas>
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
  width: 100vw;
  height: 100vh;
  background-color: transparent;
  position: fixed;
  z-index: -2;
}
</style>
