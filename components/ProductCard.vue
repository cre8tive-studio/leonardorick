<!-- sample component to be deleted -->
<template>
  <div class="card text-center">
    <p class="font-bold text-gray-500 m-4 truncate">{{ product.title }}</p>
    <NuxtLink :to="`products/${product.id}`">
      <button class="lr-button my-4">click here</button>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { Product } from '../types/product';

// example on how to use definePropsRefs from vue-macros
const { product } = definePropsRefs<{ product: Product }>();
</script>

<style scoped></style>
