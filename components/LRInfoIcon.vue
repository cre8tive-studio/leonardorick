<template>
  <fa
    class="info"
    lr-cursor
    aria-hidden="false"
    icon="circle-info"
    @click="$emit('click')"
  />
</template>

<script setup lang="ts">
interface Emits {
  (event: 'click'): void;
}

defineEmits<Emits>();
</script>

<style scoped lang="scss">
svg.info {
  position: absolute;
  display: inline;
  padding: 12px;
  cursor: none;
  top: 50%;
  transform: translateY(-50%);

  border-radius: 50%;

  transition: color 0.3s $default-ease;

  &:hover {
    color: $highlight;
  }
  &:active {
    color: $highlight-2;
  }
  > * {
    pointer-events: none;
  }
}
</style>
