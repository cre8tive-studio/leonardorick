<template>
  <!-- adding client-only fixed the bug that the toggle was always starting with english -->
  <ClientOnly>
    <div class="c-LRLanguageToggle">
      <div class="flags-container">
        <SvgoFlagUnitedKingdom filled />
        <SvgoFlagBrazil filled />
      </div>
      <div
        lr-cursor
        class="toggle"
        :class="lang"
        @click="toggleLanguage"
      />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useAppStore } from '~/store';
import type { LanguageOptions } from '~/utils/constants/languages';

const { lang } = toRefs(useAppStore());

const invertedLanguage: Record<LanguageOptions, LanguageOptions> = {
  en: 'pt-BR',
  'pt-BR': 'en',
};

function toggleLanguage() {
  lang.value = invertedLanguage[lang.value];
}
</script>

<style scoped lang="scss">
.c-LRLanguageToggle {
  width: fit-content;
  position: relative;
  --height: 20px;
  --width: 56px;
  .flags-container {
    height: var(--height);
    width: var(--width);
    border-radius: var(--height);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    svg {
      height: 140%;
      width: 140%;
      position: relative;
      scale: 1.1;
      filter: grayscale(1);
      transition: filter 0.3s $default-ease;
    }

    &:has(~ .toggle:hover) {
      svg {
        filter: none;
      }
    }
  }

  .toggle {
    cursor: none;
    position: absolute;

    height: calc(var(--height) + 11px);
    aspect-ratio: 1;
    top: 50%;
    transform: translateY(-50%);

    border-radius: 50%;
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

    &:hover {
      background-color: $main-dark-text;
    }
  }
}
</style>
