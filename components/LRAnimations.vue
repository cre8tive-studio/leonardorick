<template>
  <LRCursor />
  <LRLogoOverlay />
  <FluidBackground />
  <ThreeLeonardoRick />
</template>

<script setup lang="ts">
import useAnimations from '~/composables/animations/use-animations';
const { activate } = useAnimations();
onMounted(async () => {
  await activate();
});
</script>

<style scoped lang="scss"></style>
