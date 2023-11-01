<template>
  <div v-if="loaded">
    <h2>Home</h2>
    <p class="pb-5">
      {{ $t('welcome') }}
    </p>

    <div>
      <div
        v-for="recommendation in recommendations"
        :key="recommendation.id"
      >
        {{ recommendation }}
      </div>

      <br />

      <div
        v-for="quote in quotes"
        :key="quote.id"
      >
        {{ quote }}
      </div>
    </div>
  </div>
  <div v-else>loading...</div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/store';

const { loaded, recommendations, quotes } = toRefs(useAppStore());
</script>
<style scoped></style>
