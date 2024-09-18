<template>
  <div
    ref="loadingBar"
    class="c-LoadingBar"
    :style="{ width }"
  ></div>
</template>

<script setup lang="ts">
interface Props {
  progress: number;
  total: number;
}
const props = defineProps<Props>();
const loadingBar = ref();
const width = computed(() => `${(props.progress / props.total) * 100}%`);
defineExpose({ loadingBar });
</script>

<style lang="scss" scoped>
.c-LoadingBar {
  height: clamp(0.1rem, 1.3vw, 0.4rem);
  width: 0;
  background-color: $highlight;
  transition: width 0.5s ease-in-out;
}
</style>
