<template>
  <FluidBackground />
</template>

<script setup lang="ts">
import useAnimations from '~/composables/animations/use-animations';
const { activate } = useAnimations();
onMounted(() => {
  activate();
});
</script>

<style scoped></style>
