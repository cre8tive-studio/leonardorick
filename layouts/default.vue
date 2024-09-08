<template>
  <div class="l-default">
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
<script setup lang="ts"></script>
<style scoped lang="scss">
.l-default {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  &__header-container {
    z-index: 1;
  }
}
@media (min-width: $lg-breakpoint) {
  .l-default {
  }
}
</style>
