<template>
  <div class="relative l-default">
    <LRHeader />
    <main
      role="main"
      class="default-slot flex-grow"
    >
      <slot />
    </main>

    <LRFooter />
  </div>
</template>
<script setup lang="ts">
import { useAppStore } from '~/store';

const { defaultLayoutMounted } = toRefs(useAppStore());
onMounted(() => {
  defaultLayoutMounted.value = true;
});
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
