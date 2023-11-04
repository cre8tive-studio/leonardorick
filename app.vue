<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import type { UseNuxtAppInitModel } from './types/use-nuxt-app-init.model';
import useHeadConfig from './composables/use-head-config';
import type { RecommendationModel } from './types/recommendation-model';
import type { QuoteModel } from './types/quote.model';
import type { Media } from './types/payload-types';
import { getExpireTime } from './utils/js-utilities';
import { useAppStore } from '~/store';

setInterval(() => {
  console.log(new Date());
}, 5000);

useHeadConfig();
const { loaded, lang, recommendations, quotes } = toRefs(useAppStore());
const nuxtApp = useNuxtApp() as UseNuxtAppInitModel;
const { $recommendations, $quotes, $fetchInitialData, $initializerClientError } = nuxtApp;

if ($initializerClientError) {
  // todo setup modal error
  console.error($initializerClientError);
}

await setHomeView($recommendations.value, $quotes.value);

watch(lang, async () => {
  loaded.value = false;
  const res = await $fetchInitialData();
  setHomeView(res.$recommendations.value, res.$quotes.value);
});

async function setHomeView(rcs: RecommendationModel[], qts: QuoteModel[]) {
  recommendations.value = rcs;
  quotes.value = qts;

  recommendations.value.forEach(async (rc) => {
    const url = (rc.author.image as Media).cloudinary?.secure_url;
    if (url) {
      const { data, error } = await useFetch(url, {
        onResponse({ response }) {
          rc.authorImage = URL.createObjectURL(response._data);
        },
        responseType: 'blob',
        // sadly if we call in server it gives a weird error: Cannot stringify arbitrary non-POJOs.
        // try to debug that later and remove the <ClientOnly> tag on index.vue after fixing it
        server: false,
        transform(input: Blob) {
          return {
            blob: input,
            expire: getExpireTime(60),
          };
        },
        getCachedData(key: string) {
          const cached = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
          if (!cached) {
            return null;
          }
          if (isNotExpired(cached.expire)) {
            return cached;
          }
        },
      });

      if (error.value) {
        // todo: setup modal error
        // and setup a default image
        console.error(error.value);
      }

      // this if will be reached when the value is cached because
      // the first call pass through 'onResponse' interceptor
      // and data.value is null since pending.value is true
      if (data.value) {
        rc.authorImage = URL.createObjectURL(data.value.blob);
      }
    }
  });
  loaded.value = true;
}
</script>
