<template>
  <canvas
    id="canvas"
    ref="canvas"
  ></canvas>
</template>

<script setup lang="ts">
import useExperience from '../composables/three/use-experience';

const canvas = ref<HTMLCanvasElement>();

onMounted(() => {
  if (!canvas.value) {
    return;
  }

  window.LEONARDO_RICK = useExperience(canvas.value);
});
</script>

<style scoped></style>
