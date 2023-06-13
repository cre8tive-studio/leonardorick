<!-- sample component to be deleted -->
<template>
  <div class="card text-center">
    <p class="font-bold text-gray-500 m-4 truncate">{{ product.title }}</p>
    <NuxtLink :to="`products/${product.id}`">
      <button class="lr-button my-4">click here</button>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts" generic="T">
const { product } = defineProps<{ product: { id: string; title: string } }>();
</script>

<style scoped></style>
