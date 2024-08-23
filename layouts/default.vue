<template>
  <div class="relative l-default">
    <div
      v-if="loaded"
      class="lr-section lr-overlaping-allow-hover l-default__header-container w-full flex fixed justify-end xl:justify-between"
    >
      <NuxtLink
        class="home-logo main-hover-button h-fit hidden xl:inline-block"
        :to="localeRoute('/')"
      >
        <SvgoLeonardorick />
      </NuxtLink>
      <LRHeader />
    </div>
    <main
      role="main"
      class="default-slot flex-grow"
    >
      <slot />
    </main>

    <LRFooter v-if="loaded" />
  </div>
</template>
<script setup lang="ts">
import { useAppStore } from '~/store';

const { lang, loaded } = toRefs(useAppStore());
const localeRoute = computed(() => (r: string) => lang.value === 'en' ? r : `${r}?locale=${lang.value}`);
</script>
<style scoped lang="scss">
.l-default {
  &__header-container {
    z-index: 1;
  }
}
@media (min-width: $xl-breakpoint) {
  .l-default {
    .home-logo {
      svg {
        height: 3rem;
        width: 3rem;
      }
    }
  }
}
</style>
