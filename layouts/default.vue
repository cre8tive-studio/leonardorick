<template>
  <div class="relative l-default">
    <div
      v-if="loaded"
      class="lr-section w-full flex fixed justify-end xl:justify-between"
    >
      <NuxtLink
        class="home-logo main-hover-button h-fit hidden xl:inline-block"
        :to="localeRoute('/')"
      >
        <SvgoLeonardorick />
      </NuxtLink>
      <LRHeader />
    </div>
    <div class="default-slot flex-grow top-0 left-0">
      <slot />
    </div>

    <LRFooter v-if="loaded" />
  </div>
</template>
<script setup lang="ts">
import { useAppStore } from '~/store';

const { lang, loaded } = toRefs(useAppStore());

const localeRoute = computed(() => (r: string) => lang.value === 'en' ? r : `${r}?locale=${lang.value}`);
</script>
<style scoped lang="scss">
@media (min-width: $xl-breakpoint) {
  .l-default {
    .home-logo {
      svg {
        height: 48px;
        width: 48px;
      }
    }
  }
}
</style>
