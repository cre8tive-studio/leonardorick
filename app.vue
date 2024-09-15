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
import type { ExperienceModel } from './types/experience.model';
import { useAppStore } from '~/store';

useHeadConfig();

const nuxtApp = useNuxtApp();
const {
  $recommendations,
  $quotes,
  $experiences,
  $generals,
  $personalInfo,
  $fetchInitialData,
  $initializerClientError,
} = nuxtApp;
const { isContentLoaded, isContentErrored, lang, recommendations, experiences, quotes, generals, personalInfo } =
  toRefs(useAppStore());

if ($initializerClientError) {
  // todo setup modal error
  // eslint-disable-next-line no-console
  console.error($initializerClientError);
}

watch(lang, async () => {
  isContentLoaded.value = false;
  const res = await $fetchInitialData();
  if (!res.$recommendations || !res.$quotes || !res.$experiences || !res.$generals) {
    isContentErrored.value = true;
    return;
  }
  setHomeView(res.$recommendations, res.$quotes, res.$experiences, res.$generals);
});

/**
 * using onMounted was causing the images to not render, so then, we run this before mounting
 */
onBeforeMount(async () => {
  if (!$personalInfo.value || !$recommendations.value || !$quotes.value || !$experiences.value || !$generals.value) {
    isContentErrored.value = true;
    return;
  }

  personalInfo.value = $personalInfo.value;
  await setHomeView($recommendations.value, $quotes.value, $experiences.value, $generals.value);
});

async function setHomeView(
  rcs: RecommendationModel[],
  qts: QuoteModel[],
  exps: ExperienceModel[],
  gnrs: GeneralsModel[]
) {
  recommendations.value = rcs;
  quotes.value = qts;
  generals.value = gnrs;
  experiences.value = exps;

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
        // try to debug that later and remove the <ClientOnly> tag on LRRecommendationsSection.vue after fixing it.
        // if somehow it works, remember to remove the <ClientOnly tag from the recommendations images
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
  recommendations.value.sort((r1, r2) => r1.order || 0 - (r2.order || 0));
  isContentLoaded.value = true;
}
</script>
