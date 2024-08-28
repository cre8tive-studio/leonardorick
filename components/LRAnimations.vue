<template>
  <LRCursor />
  <LRLogoOverlay />
  <FluidBackground />
  <ThreeLeonardoRick />
</template>

<script setup lang="ts">
import useAnimations from '~/composables/animations/use-animations';

const { activate, cleanup } = useAnimations();
// it's better to run this component after the default
// layout is mounted  so we have access to dom elements
onMounted(async () => {
  await activate();
});

onUnmounted(() => {
  cleanup();
});
</script>

<style scoped lang="scss"></style>
