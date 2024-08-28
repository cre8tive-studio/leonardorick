<template>
  <div
    v-for="paragraph in info.data"
    :key="paragraph.id"
    class="c-LRGeneralText"
  >
    <component
      :is="paragraph.htmlTag"
      :id="'p-' + paragraph.id"
      ref="tags"
      :aria-label="paragraphsFullText[paragraph.id]?.fullText"
    >
      <template v-if="paragraph.text.length > 1">
        <span
          v-for="(segment, sindex) in paragraph.text"
          :key="sindex"
          :class="{ bold: segment.bold }"
        >
          {{ segment.text }}
        </span>
      </template>
      <template v-else> {{ paragraph.text[0]?.text }}</template>
    </component>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';

import SplitType from 'split-type';
import type { GeneralsModel } from '../types/generals.model';
interface Props {
  info: GeneralsModel;
}
interface ComponentParagraphInfo {
  fullText: string;
  animation?: any;
}
const tags = ref<HTMLElement[]>();
const { info } = defineProps<Props>();
const paragraphsFullText: Record<string, ComponentParagraphInfo> = reactive({});

onBeforeMount(() => {
  setParagraphsInfo();
});

onMounted(async () => {
  init();
});

function init() {
  if (!tags.value || !tags.value.length) return;

  for (const tag of tags.value) {
    const paragraphInfo = info.data.find((paragraph) => tag.id === `p-${paragraph.id}`);

    if (!paragraphInfo || paragraphInfo.animationType === 'none') {
      continue;
    }

    const text = new SplitType(tag, {
      types: 'words,chars',
    });

    gsap.killTweensOf(tag);
    // todo set how animations happens based on animationType defined in payload
    gsap.from(text.chars, {
      scrollTrigger: {
        trigger: tag,
        start: 'top 93%',
        end: 'top 42%',
        scrub: true,
        markers: false,
      },
      opacity: 0.3,
      stagger: 0.2,
    });
  }
}

function setParagraphsInfo() {
  for (const paragraph of info.data) {
    paragraphsFullText[paragraph.id] = {
      fullText: getFullText(paragraph),
    };
  }
}

function getFullText(item: GeneralsModel['data'][0]) {
  return item.text.reduce((acum, curr) => {
    acum += curr.text;
    return acum;
  }, '');
}
</script>

<style scoped lang="scss">
.c-LRGeneralText {
  pointer-events: none;
  & > * {
    pointer-events: none;
    span {
      pointer-events: auto;
    }
  }
}
</style>
