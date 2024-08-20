<template>
  <NuxtRouteAnnouncer />
  <ClientOnly>
    <LRAnimations />
  </ClientOnly>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import useHeadConfig from './composables/use-head-config';
import type { RecommendationModel } from './types/recommendation-model';
import type { QuoteModel } from './types/quote.model';
import type { Media } from './types/payload-types';
import type { GeneralsModel } from './types/generals.model';
import { getExpireTime } from './utils/js-utilities';
import { useAppStore } from '~/store';

useHeadConfig();

const { contentLoaded, lang, recommendations, quotes, generals } = toRefs(useAppStore());
const nuxtApp = useNuxtApp();
const { $recommendations, $quotes, $generals, $fetchInitialData, $initializerClientError } = nuxtApp;

if ($initializerClientError) {
  // todo setup modal error
  // eslint-disable-next-line no-console
  console.error($initializerClientError);
}

if ($recommendations.value && $quotes.value && $generals.value) {
  await setHomeView($recommendations.value, $quotes.value, $generals.value);
}

watch(lang, async () => {
  contentLoaded.value = false;
  const res = await $fetchInitialData();
  if (res.$recommendations.value && res.$quotes.value && res.generals.value) {
    setHomeView(res.$recommendations.value, res.$quotes.value, res.$generals.value);
  }
});

async function setHomeView(rcs: RecommendationModel[], qts: QuoteModel[], gnrs: GeneralsModel[]) {
  recommendations.value = rcs;
  quotes.value = qts;
  generals.value = gnrs;

  recommendations.value.forEach(async (rc) => {
    /**
     * setting up cloudinary image
     */
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
        // eslint-disable-next-line no-console
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
  contentLoaded.value = true;
}
</script>
