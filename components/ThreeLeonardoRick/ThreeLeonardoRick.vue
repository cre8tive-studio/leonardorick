<template>
  <canvas
    id="logoLeonardoRick"
    ref="logoCanvasRef"
  />
</template>
<script setup lang="ts">
import { useAnimationStore } from '~/store/animation';

/**
 * data
 */
const animationStore = useAnimationStore();
const { logoCanvas } = toRefs(animationStore);
const logoCanvasRef = ref<HTMLCanvasElement>();

onMounted(async () => {
  logoCanvas.value = logoCanvasRef.value;
});
</script>

<style scoped lang="scss">
#logoLeonardoRick {
  z-index: -3;
  position: fixed;
}
</style>
