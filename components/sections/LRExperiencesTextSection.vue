<template>
  <div
    id="experience"
    class="s-ExperienceTextSection lr-section-page lr-section-page-no-paddings relative"
  >
    <LRColorfulTile
      :colors="colors"
      :background-color="tilesBackgroundColor"
    />
    <div class="wrapper-default-generals-text lr-section-page-paddings pointer-events-none h-full">
      <LRGeneralText
        v-if="experienceContent"
        ref="generalText"
        :key="refreshKey"
        :info="experienceContent"
        @mousemove="mousemoveHandler"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/store';
import { COLORS } from '~/utils/constants/colors';
import LRGeneralText from '~/components/LRGeneralText.vue';

interface Props {
  refreshKey: number;
}
defineProps<Props>();

const { generals, experienceYears } = toRefs(useAppStore());
const generalText = ref<InstanceType<typeof LRGeneralText>>();

const experienceContent = computed(() => {
  const experience = structuredClone(toRaw(generals.value.find((general) => general.key === 'experience')));
  if (experience) {
    experience.data[1]?.text.unshift({ text: `${experienceYears.value} ` });
  }
  return experience;
});
const colors = [COLORS.blue1, COLORS.blue2, COLORS.blue3, COLORS.blue4, COLORS.blue5];
const tilesBackgroundColor = COLORS.mainDarkBg;

let lastUnder: Element;
function mousemoveHandler(e: MouseEvent) {
  if (!generalText.value?.self) return;
  generalText.value.self.style.visibility = 'hidden';

  const $under = document.elementFromPoint(e.clientX, e.clientY);
  if ($under) {
    if (lastUnder && lastUnder.id !== $under.id) {
      lastUnder.classList.remove('hovered');
    }
    $under.classList.add('hovered');
    lastUnder = $under;
  }

  generalText.value.self.style.visibility = 'visible';
}
</script>

<style scoped lang="scss">
.s-ExperienceTextSection {
  margin-bottom: 8rem;
}
</style>
