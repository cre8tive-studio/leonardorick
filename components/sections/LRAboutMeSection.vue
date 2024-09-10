<template>
  <div class="about-me lr-section-page lr-section-page-no-paddings relative">
    <div class="about-me-text wrapper-default-generals-text lr-section-page-paddings pointer-events-none">
      <LRGeneralText
        v-if="aboutMeContent"
        :key="refreshKey"
        :info="aboutMeContent"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/store';

interface Props {
  refreshKey: number;
}
defineProps<Props>();

const { generals } = toRefs(useAppStore());
const aboutMeContent = computed(() => generals.value.find((general) => general.key === 'about-me'));
</script>

<style scoped lang="scss"></style>
