<template>
  <template
    v-for="paragraph in info.data"
    :key="paragraph.id"
  >
    <component
      :is="paragraph.htmlTag"
      :id="'p-' + paragraph.id"
      ref="tags"
      :aria-label="paragraphsFullText[paragraph.id].fullText"
    >
      <template v-if="paragraph.text.length > 1">
        <span
          v-for="(segment, sindex) in paragraph.text"
          :key="sindex"
          :class="{ highlight: segment.bold }"
        >
          {{ segment.text }}
        </span>
      </template>
      <template v-else> {{ paragraph.text[0].text }}</template>
    </component>
  </template>
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
  if (!tags.value || !tags.value.length) {
    return;
  }

  for (const tag of tags.value) {
    const paragraphInfo = info.data.find((paragraph) => tag.id === `p-${paragraph.id}`);

    if (!paragraphInfo || paragraphInfo.animationType === 'none') {
      continue;
    }

    const text = new SplitType(tag, {
      types: 'words,chars',
    });

    // todo set how animations happens based on animationType defined in payload
    gsap.from(text.chars, {
      scrollTrigger: {
        trigger: tag,
        start: 'top 96%',
        end: 'top 42%',
        scrub: true,
        markers: false,
      },
      opacity: 0.3,
      stagger: 0.2,
    });
  }
});

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
.highlight {
  color: $highlight;
}

@media (min-width: $xl-breakpoint) {
  h1 {
    font-size: 1.5rem; /* 24px */
    line-height: 2rem; /* 32px */
    font-weight: 300;
    text-transform: uppercase;
  }
  p {
    font-size: 72px;
    line-height: 86px;
    letter-spacing: 0.3rem;
    :deep(> *) {
      display: inline !important;
    }
  }
}
</style>
