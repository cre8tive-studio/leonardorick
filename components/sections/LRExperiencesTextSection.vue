<template>
  <div class="s-ExperienceTextSection lr-section-page lr-section-page-no-paddings relative">
    <LRColorfulTile
      :colors="colors"
      :background-color="tilesBackgroundColor"
    />
    <div class="wrapper-default-generals-text lr-section-page-paddings lr-safe-pointer-events-none">
      <LRGeneralText
        v-if="experienceContent"
        :key="refreshKey"
        :info="experienceContent"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/store';
import { COLORS } from '~/utils/constants/colors';
import { DEFAULTS } from '~/utils/constants/defaults';

interface Props {
  refreshKey: number;
}
defineProps<Props>();

const { generals, personalInfo } = toRefs(useAppStore());

const experienceYears = computed(
  () =>
    new Date().getFullYear() - new Date(personalInfo.value?.startWorkingDate || DEFAULTS.startWorkingDate).getFullYear()
);
const experienceContent = computed(() => {
  const experience = structuredClone(toRaw(generals.value.find((general) => general.key === 'experience')));
  if (experience) {
    experience.data[1]?.text.unshift({ text: `${experienceYears.value} ` });
  }
  return experience;
});
const colors = [COLORS.blue1, COLORS.blue2, COLORS.blue3, COLORS.blue4, COLORS.blue5];
const tilesBackgroundColor = COLORS.mainDarkBg;
</script>

<style scoped lang="scss">
.s-ExperienceTextSection {
  margin-bottom: 8rem;
}
</style>
