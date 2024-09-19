<template>
  <!-- adding client-only fixed the bug that the toggle was always starting with english -->
  <ClientOnly>
    <div class="c-LRLanguageToggle">
      <SvgoFlagUnitedKingdom filled />
      <SvgoFlagBrazil filled />
      <div
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
  --height: 21px;
  height: var(--height);
  width: 55px;
  border-radius: var(--height);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &:hover {
    svg {
      filter: none;
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
    width: 58%;
    cursor: pointer;
    border-radius: 10px;
    background-color: $main-dark-text;
    transition: background-color 0.3s $default-ease, all 0.5s $default-ease;
    left: 45%;
    right: 45%;
    &.en {
      right: 0;
    }
    &.pt-BR {
      left: 0;
    }
  }
}
</style>
