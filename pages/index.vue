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
    <LRFooterController />
  </template>
  <template v-else>
    <LRMainErrorSection />
  </template>

  <!-- <div class="lr-section-page">
      <div class="wrapper-default-generals-text">
        <LRGeneralText
          v-if="environmentContent"
          :key="refreshKey"
          :info="environmentContent"
        />
      </div>
    </div> -->
</template>

<script setup lang="ts">
import { useAppStore } from '~/store';
const { loaded, contentLoaded } = toRefs(useAppStore());
const refreshKey = ref(0);

// const environmentContent = computed(() => generals.value.find((general) => general.key === 'environment'));

watch(contentLoaded, () => {
  refreshKey.value++;
});
</script>
<style scoped lang="scss"></style>
