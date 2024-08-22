<template>
  <template
    v-for="paragraph in info.data"
    :key="paragraph.id"
  >
    <component :is="paragraph.htmlTag">
      <template v-if="paragraph.text.length > 1">
        <span
          v-for="(segment, index) in paragraph.text"
          :key="index"
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
import type { GeneralsModel } from '../types/generals.model';

interface Props {
  info: GeneralsModel;
}
const _props = defineProps<Props>();
</script>

<style scoped lang="scss">
.highlight {
  color: $highlight;
}

@media (min-width: $xl-breakpoint) {
  h1 {
    font-size: 2.25rem;
    line-height: 2.5rem;
  }
  p {
    font-size: 72px;
    line-height: 86px;
    letter-spacing: 0.3rem;
  }
}
</style>
