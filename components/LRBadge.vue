<template>
  <div
    class="lr-badge flex gap-3 items-center w-fit h-fit"
    :class="status"
  >
    <span class="light"></span>
    <span>{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
export type BadgeStatus = 'warning' | 'error' | 'success';
export interface BadgeProps {
  text: string;
  status: BadgeStatus;
}
const { text, status } = defineProps<BadgeProps>();
</script>

<style scoped lang="scss">
.lr-badge {
  --color: var(--success);
  padding: 4px 16px;
  background-color: $dark-text-5;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: $box-shadow-elevation-2;
  color: var(--color);

  &.success {
    --color: var(--success);
  }

  &.warning {
    --color: var(--warning);
  }

  &.error {
    --color: var(--error);
  }

  .light {
    height: 12px;
    width: 12px;
    border-radius: 50%;
    box-shadow: 0 0 8px 3px rgba(var(--color), 0.7);
    background-color: var(--color);
  }
}
</style>
