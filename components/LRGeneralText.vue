<template>
  <div
    ref="self"
    class="c-LRGeneralText"
    @mousemove="$emit('mousemove', $event)"
  >
    <div
      v-for="paragraph in info.data"
      :key="paragraph.id"
    >
      <component
        :is="paragraph.htmlTag"
        :id="`id-${paragraph.id}`"
        ref="tags"
        :aria-label="paragraphsFullText[paragraph.id]?.fullText"
      >
        <template v-if="paragraph.text.length > 1">
          <span
            ref="text"
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
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import SplitType from 'split-type';
import { getGeneralsFullText } from '~/utils/parsers/generals.parser';
import { SCROLL_TRIGGER_IDS } from '~/utils/constants/scroll-trigger-ids';
import type { GeneralsModel } from '../types/generals.model';

interface Props {
  info: GeneralsModel;
}
interface ComponentParagraphInfo {
  fullText: string;
  animation?: any;
}
const { info } = defineProps<Props>();
const tags = ref<HTMLElement[]>();
const self = ref<HTMLDivElement>();

defineExpose({ self });

const paragraphsFullText: Record<string, ComponentParagraphInfo> = reactive({});
const scrollTriggerId = computed(() => SCROLL_TRIGGER_IDS.GENERALS + info.id);

onMounted(async () => {
  setMetadata();
  init();
});

function init() {
  if (!tags.value || !tags.value.length) return;
  for (const tag of tags.value) {
    const paragraphInfo = info.data.find((paragraph) => tag.id === `id-${paragraph.id}`);
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
        id: scrollTriggerId.value,
        trigger: tag,
        start: 'top 80%',
        end: 'top 38%',
        scrub: true,
      },
      opacity: 0.3,
      stagger: 0.2,
    });
  }
}

onUnmounted(() => {
  ScrollTrigger.getById(scrollTriggerId.value)?.kill(true);
});

function setMetadata() {
  for (const paragraph of info.data) {
    // set full string content so it can be used as a11y value
    paragraphsFullText[paragraph.id] = {
      fullText: getGeneralsFullText(paragraph),
    };

    // add classes relative to the animation. Uncomment this and remove gsap when you undestand
    // how  to apply this effect in phrases with words with multiple colors
    // if (paragraph.animationType === 'fadeOpacity') {
    // tags.value?.find((el) => el.id === `id-${paragraph.id}`)?.classList.add('lr-fade-opacity');
    // }
  }
}
</script>

<style scoped lang="scss">
.c-LRGeneralText {
  pointer-events: none;
  & > * {
    pointer-events: none;
    span {
      display: inline !important;
      pointer-events: auto;
    }
  }
}
</style>
