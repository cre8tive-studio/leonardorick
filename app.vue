<template>
  <NuxtRouteAnnouncer />
  <LROverlay />
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

const { getCachedImage } = useCachedImage();

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
 * using onbeforeMount was also givin an error when changing languages:
 * TypeError: Cannot read properties of null (reading 'insertBefore')
 */
if (!$personalInfo.value || !$recommendations.value || !$quotes.value || !$experiences.value || !$generals.value) {
  isContentErrored.value = true;
} else {
  personalInfo.value = $personalInfo.value;
  await setHomeView($recommendations.value, $quotes.value, $experiences.value, $generals.value);
}

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

  for (const rc of recommendations.value) {
    rc.authorImage = await getCachedImage(rc.author.id, rc.author.image.cloudinary?.secure_url);
  }

  for (const xp of experiences.value) {
    xp.companyImage = await getCachedImage(xp.company.id, xp.company.image.cloudinary?.secure_url);
  }

  recommendations.value.sort((r1, r2) => r1.order || 0 - (r2.order || 0));
  isContentLoaded.value = true;
}
</script>
