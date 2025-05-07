<template>
  <LRInfoIcon v-tooltip="tooltipContent" />
</template>

<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';

interface Props {
  tooltip: string;
}
const { tooltip } = defineProps<Props>();

const canHover = useMediaQuery('(hover: hover)');

const tooltipContent = computed(() => ({
  content: tooltip,
  showTriggers: canHover.value ? ['hover', 'focus', 'touch', 'click'] : ['click'],
  hideTriggers: canHover.value ? ['hover', 'focus', 'touch', 'click'] : ['click'],
  autoHide: !canHover.value,
}));
</script>

<style scoped></style>
