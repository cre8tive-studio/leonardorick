<template>
  <template v-if="loaded">
    <LRMainSection />
    <LRAboutMeSection :refresh-key="refreshKey" />
    <LRWhatIDoSection />
    <LRExperiencesTextSection :refresh-key="refreshKey" />
    <LRTimelineSection />
    <LRCompetencesSection />
    <LRRecommendationsSection />
    <LRQuotesSection :key="refreshKey" />
    <LRFooterController v-if="isLg" />
    <LRMobileFooter v-else />
  </template>

  <template v-if="isContentErrored">
    <LRMainErrorSection />
  </template>
</template>

<script setup lang="ts">
import { useAppStore } from '~/store';

const { loaded, isContentLoaded, isContentErrored } = toRefs(useAppStore());
const { isLg } = useCssBreakpoints();

const refreshKey = ref(0);
watch(isContentLoaded, () => {
  refreshKey.value++;
});
</script>
<style scoped lang="scss"></style>
