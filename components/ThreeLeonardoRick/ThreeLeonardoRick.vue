<template>
  <canvas
    v-if="!isLRModelTimedout"
    id="logoLeonardoRick"
    ref="logoCanvasRef"
    aria-hidden="true"
  />
</template>
<script setup lang="ts">
import { useAnimationStore } from '~/store/animation';

/**
 * data
 */
const animationStore = useAnimationStore();
const { logoCanvas, isLRModelTimedout } = toRefs(animationStore);
const logoCanvasRef = ref<HTMLCanvasElement>();

onMounted(async () => {
  logoCanvas.value = logoCanvasRef.value;
});
</script>

<style scoped lang="scss">
#logoLeonardoRick {
  z-index: -30;
  position: fixed;
}
</style>
