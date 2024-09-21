<template>
  <!-- adding client-only fixed the bug that the toggle was always starting with english -->
  <ClientOnly>
    <div
      lr-cursor
      class="c-LRLanguageToggle"
      @click="toggleLanguage"
    >
      <SvgoFlagUnitedKingdom filled />
      <SvgoFlagBrazil filled />
      <div
        class="toggle"
        :class="lang"
      />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useAppStore } from '~/store';
import type { LanguageOptions } from '~/utils/constants/languages';

const { lang } = toRefs(useAppStore());
const $emit = defineEmits<{ (e: 'change'): void }>();

const invertedLanguage: Record<LanguageOptions, LanguageOptions> = {
  en: 'pt-BR',
  'pt-BR': 'en',
};

function toggleLanguage() {
  lang.value = invertedLanguage[lang.value];
  $emit('change');
}
</script>

<style scoped lang="scss">
.c-LRLanguageToggle {
  --border: 3px;
  --height: calc(21px + var(--border));
  height: var(--height);
  width: calc(57px + var(--border));
  border-radius: var(--height);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border-bottom: var(--border) solid transparent;
  border-right: var(--border) solid transparent;
  > * {
    pointer-events: none; // allow lr-cursor to work properly
  }

  &:hover {
    svg {
      filter: none;
    }

    .toggle {
      background-color: $main-dark-text;
    }
  }
  svg {
    height: 130%;
    width: 130%;
    position: relative;
    scale: 1.1;
    filter: grayscale(1);
    transition: filter 0.3s $default-ease;
  }
  .toggle {
    position: absolute;

    top: 0;
    height: 100%;
    width: 59%;

    border-radius: 10px;
    transition: background-color 0.3s $default-ease, all 0.5s $default-ease;
    left: 45%;
    right: 45%;
    background-color: $secoundary-dark-text;

    &.en {
      right: 0;
    }
    &.pt-BR {
      left: 0;
    }
  }
}
</style>
