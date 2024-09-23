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
    z-index: 10; // allow z-index from 1-9 in the content of the slot
  }
}
</style>
