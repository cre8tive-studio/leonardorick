<template>
  <div
    id="about-me"
    class="s-LRAboutMeSection lr-section-page lr-section-page-no-paddings"
  >
    <h1 class="lr-section-page-paddings section-h1">{{ $t('about_me') }}</h1>
    <div class="options-wrapper lr-section-page-paddings">
      <nav
        ref="optionsNav"
        @scroll="menuScrollHandler"
        class="options"
      >
        <button
          lr-cursor
          class="option"
          :class="{ selected: selectedOption === option.value }"
          @click="selectOption(option.value)"
          v-for="option in options"
        >
          <span>{{ $t(option.label) }}</span>
          <span>{{ $t(option.label) }}</span>
        </button>
        <div
          class="shadow left"
          :class="{ scrolled: menuScrolled }"
        />
        <div class="shadow right" />
      </nav>
    </div>
    <div class="about-me-text wrapper-default-generals-text lr-section-page-paddings">
      <LRGeneralText
        v-if="anyone"
        :key="refreshKey"
        :info="anyone"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/store';

interface Props {
  refreshKey: number;
}
defineProps<Props>();

const { generals } = toRefs(useAppStore());
const optionsNav = ref<HTMLDivElement>();
const selectedOption = ref('anyone');
const scrolled = ref(0);

const options = [
  { label: 'for_anyone', value: 'anyone' },
  { label: 'recruiters', value: 'recruiters' },
  { label: 'engineers', value: 'engineers' },
  { label: 'designers', value: 'designers' },
  { label: 'product_managers', value: 'product-managers' },
];

const menuScrolled = computed(() => {
  return scrolled.value > 7;
});

const anyone = computed(() => generals.value.find((general) => general.key === 'about-me'));

function selectOption(option: string) {
  selectedOption.value = option;
}

function menuScrollHandler() {
  if (!optionsNav.value) return;

  scrolled.value = optionsNav.value.scrollLeft > 0 ? optionsNav.value.scrollLeft : 0;
}
</script>

<style scoped lang="scss">
.s-LRAboutMeSection {
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-x: hidden; // for the shadows

  .options-wrapper {
    position: relative;
    margin-bottom: clamp(0.5rem, 1.2vw, 1.7rem);

    .options {
      @extend .hide-scrollbar;

      display: flex;
      gap: clamp(0rem, 1vw, 0.5rem);
      overflow: visible;
      overflow-x: auto;

      .shadow {
        width: 150px;
        height: 180%;
        top: 50%;
        translate: 0 -50%;
        position: absolute;

        pointer-events: none;
        border-radius: 50%;
        transition: opacity 0.3s $default-ease;

        &.left {
          left: -10vw;

          opacity: 0;
          background: linear-gradient(90deg, rgba($main-dark-bg, 1) 40%, rgba($main-dark-bg, 0) 90%);
          &.scrolled {
            opacity: 1;
          }
        }

        &.right {
          left: 110vw;
          transform: translateX(-100%);
          background: linear-gradient(90deg, rgba($main-dark-bg, 0) 10%, rgba($main-dark-bg, 1) 69%);
        }
      }

      .option {
        --padding: 12px 10px; // used in .cursor-rolling-menu-item
        --translate: 180%; // used in .cursor-rolling-menu-item
        @extend .cursor-rolling-menu-item;
        @extend .lr-text--body-0-half;
        padding: var(--padding);
        border-radius: 8px;
        min-width: fit-content;
        cursor: pointer;

        &:first-child {
          padding-left: 0;
          span:nth-child(2) {
            padding-left: 0;
          }
        }

        span {
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
