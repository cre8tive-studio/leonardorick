<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import type { UseNuxtAppInitModel } from './types/use-nuxt-app-init.model';
import { useAppStore } from '~/store';

const { loaded, lang, recommendations, quotes } = toRefs(useAppStore());
const { $recommendations, $quotes, $fetchInitialData, $initializerClientError } =
  useNuxtApp() as UseNuxtAppInitModel;

if ($initializerClientError) {
  // todo setup modal error
  // eslint-disable-next-line no-console
  console.error($initializerClientError);
}

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
