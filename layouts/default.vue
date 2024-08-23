<template>
  <div class="relative l-default">
    <LRHeader v-if="loaded" />
    <main
      role="main"
      class="default-slot flex-grow"
    >
      <slot />
    </main>

    <LRFooter v-if="loaded" />
  </div>
</template>
<script setup lang="ts">
import { useAppStore } from '~/store';

const { loaded } = toRefs(useAppStore());
</script>
<style scoped lang="scss">
.l-default {
  &__header-container {
    z-index: 1;
  }
}
@media (min-width: $xl-breakpoint) {
  .l-default {
  }
}
</style>
