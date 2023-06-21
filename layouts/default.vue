<template>
  <header>
    <nav>
      <ul class="pb-5">
        <li>
          <NuxtLink :to="langRoute('/#debug')"> Home </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="langRoute('/music')"> Music </NuxtLink>
        </li>
      </ul>
    </nav>
    <ClientOnly
      fallback-tag="span"
      fallback="Loading Three.js model"
    >
      <ThreeLeonardoRick />
    </ClientOnly>
  </header>
  <!-- output page content -->
  <div>
    <slot />
  </div>
</template>
<script setup lang="ts">
import { useAppStore } from '~/store';

const { lang } = toRefs(useAppStore());
const langRoute = computed(
  () => (route: string) => lang.value === 'en' ? route : `${route}?lang=${lang.value}`
);
</script>
<style scoped></style>
