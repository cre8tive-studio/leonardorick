<template>
  <div class="mt-7 max-w-sm mx-auto text-center card">
    <p class="mt-7 text-7x1 font-bold">{{ error.statusCode }}</p>
    <p class="mt-7 text-6x1">Ooops.</p>
    <p class="mt-7">{{ error.message }}</p>
    <button
      class="lr-button my-7"
      @click="handleClearError"
    >
      Go Home
    </button>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from 'nuxt/app';
import { isProduction } from './utils/js-utilities';
const env = useRuntimeConfig().public.environment;
const { error } = definePropsRefs({
  error: {
    type: Object as PropType<NuxtError>,
    required: true,
  },
});
if (!isProduction(env)) {
  // eslint-disable-next-line no-console
  console.error(error.value.stack);
}

const handleClearError = () => clearError({ redirect: '/' });
</script>

<style scoped></style>
