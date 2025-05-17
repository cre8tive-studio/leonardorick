<template>
  <template v-if="loaded">
    <LRMainSection />
    <LRAboutMeSection
      :refresh-key="refreshKey"
      @change="aboutMeChangedHandler"
    />
    <LRWhatIDoSection />
    <LRExperiencesTextSection :refresh-key="refreshKey" />
    <LRTimelineSection />
    <LRCompetencesSection :key="scrollTriggerRefreshKey" />
    <LRRecommendationsSection :key="scrollTriggerRefreshKey" />
    <LRQuotesSection :key="scrollTriggerRefreshKey" />
    <LRFooterController
      v-if="isLg"
      :key="scrollTriggerRefreshKey"
    />
    <LRMobileFooter v-else />
  </template>

  <template v-if="isContentErrored">
    <LRMainErrorSection />
  </template>
</template>

<script setup lang="ts">
import { useInjectCssBreakpoints } from '~/plugins/providers';
import { useAppStore } from '~/store';

const { loaded, isContentLoaded, isContentErrored } = toRefs(useAppStore());
const { isLg } = useInjectCssBreakpoints();
const refreshKey = ref(0);
const scrollTriggerRefresh = ref(0);

/**
 * basically when the screen changes height by any reason, we need to re-create some scroll triggers, mainly the ones
 * that have a pin, because they get pinned on the wrong place and the animation ends up being very buggy. This solutino
 * should be used similarly in any other place of the project if the screen changes size, like when aboutMe section changes
 * and pushes all the content below.
 */
const scrollTriggerRefreshKey = computed(() => refreshKey.value + scrollTriggerRefresh.value);
function aboutMeChangedHandler() {
  scrollTriggerRefresh.value++;
}

watch(isContentLoaded, () => {
  refreshKey.value++;
});
</script>
<style scoped lang="scss"></style>
