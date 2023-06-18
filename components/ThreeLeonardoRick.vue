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

  const experience = useExperience(canvas.value);
  window.LEONARDO_RICK = experience;
});
</script>

<style scoped></style>
