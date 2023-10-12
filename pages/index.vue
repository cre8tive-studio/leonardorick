<template>
  <div v-if="loaded">
    <h2>Home</h2>
    <span>loaded: {{ loaded }}</span>
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
</template>

<script setup lang="ts">
import type { UseNuxtAppInitModel } from '../types/use-nuxt-app-init.model';
import { useAppStore } from '~/store';

const store = useAppStore();
const { loaded, lang, recommendations, quotes } = toRefs(store);
const { $recommendations, $quotes, $fetchInitialData } = useNuxtApp() as UseNuxtAppInitModel;

watch(lang, async () => {
  loaded.value = false;
  const res = await $fetchInitialData();
  recommendations.value = res.$recommendations.value;
  quotes.value = res.$quotes.value;
  loaded.value = true;
});

recommendations.value = $recommendations.value;
quotes.value = $quotes.value;
loaded.value = true;
</script>
<style scoped></style>
