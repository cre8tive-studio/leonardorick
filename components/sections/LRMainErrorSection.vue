<template>
  <div class="s-LRMainErrorSection lr-section-page">
    <h1 class="section-h1">{{ props.title ? $t(props.title) : $t('error.title_home') }}</h1>
    <h2>{{ props.subtitle ? $t(props.subtitle) : $t('error.subtitle_home') }}</h2>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  subtitle?: string;
}
const props = defineProps<Props>();
</script>

<style scoped lang="scss">
.s-LRMainErrorSection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  text-align: center;
  padding-bottom: clamp(1rem, 7vw, 7rem);

  div {
    display: flex;
    flex-direction: column;
    text-align: center;
  }
  h2 {
    @extend .lr-text--label-2;
    padding-inline: clamp(1rem, 7vw, 10rem);
  }
}
</style>
