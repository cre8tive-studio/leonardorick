<template>
  <div
    v-if="loaded"
    class="p-index"
  >
    <div class="main lr-section-page">
      <div
        ref="mainTitleContainer"
        class="main__title--container"
      >
        <h1
          ref="nameTitle"
          class="main__title title-splitted title-filled"
        >
          Leonardo Rick
          <span class="registered-icon">®</span>
        </h1>
        <h1
          ref="nameTitleOutline"
          aria-hidden="true"
          class="main__title title-splitted title-outline"
        >
          Leonardo Rick
          <span class="registered-icon">®</span>
        </h1>
      </div>
    </div>

    <LRAboutMeSection :refresh-key="refreshKey" />
    <LRWhatIDoSection />
    <div class="lr-section-page lr-section-page-no-paddings relative">
      <LRColorfulTile
        :colors="colors"
        :background-color="tilesBackgroundColor"
      />
      <div class="wrapper-default-generals-text lr-section-page-paddings lr-safe-pointer-events-none">
        <LRGeneralText
          v-if="experienceContent"
          :key="refreshKey"
          :info="experienceContent"
        />
      </div>
    </div>
    <!-- <LRCompaniesSection /> -->
    <LRRecommendations />
    <LRCompetencesSection />

    <!-- <div class="lr-section-page">
      <div class="wrapper-default-generals-text">
        <LRGeneralText
          v-if="environmentContent"
          :key="refreshKey"
          :info="environmentContent"
        />
      </div>
    </div> -->

    <div
      v-for="quote in quotes"
      :key="quote.id"
    >
      {{ quote }}
    </div>
  </div>
</template>

<script setup lang="ts">
import SplitType from 'split-type';
import { gsap } from 'gsap';
import { watchOnce } from '@vueuse/core';
import { COLORS } from '../utils/constants/colors';
import { useAppStore } from '~/store';

const { loaded, generals, quotes, contentLoaded } = toRefs(useAppStore());
const nameTitle = ref<HTMLDivElement>();
const nameTitleOutline = ref<HTMLDivElement>();
const mainTitleContainer = ref<HTMLDivElement>();

const experienceContent = computed(() => generals.value.find((general) => general.key === 'experience'));
const environmentContent = computed(() => generals.value.find((general) => general.key === 'environment'));

const colors = [COLORS.blue1, COLORS.blue2, COLORS.blue3, COLORS.blue4, COLORS.blue5];
const tilesBackgroundColor = COLORS.mainDarkBg;
const refreshKey = ref(0);

onMounted(() => {
  if (nameTitle.value) {
    runAnimations();
  } else {
    watchOnce(loaded, async () => {
      await nextTick();
      runAnimations();
    });
  }
});

watch(contentLoaded, () => {
  refreshKey.value++;
});

function runAnimations() {
  animateTitle();
  animateAndSplitChars();
}

function animateTitle() {
  if (!nameTitle.value || !nameTitleOutline.value) return;
  gsap.to(nameTitle.value, {
    scrollTrigger: {
      trigger: '.main',
      start: 'top top',
      end: () => window.innerWidth * 0.094,
      pin: nameTitle.value,
      scrub: true,
    },
    scale: 0.95,
  });

  gsap.to(nameTitleOutline.value, {
    scrollTrigger: {
      trigger: '.main',
      start: 'top top',
      end: () => window.innerWidth * 0.094,
      scrub: true,
    },
    scale: 0.95,
  });
}

function animateAndSplitChars() {
  animateRollingChars(new SplitType('.title-splitted', { types: 'chars' }));
}
function animateRollingChars(split: SplitType) {
  if (!split.chars || !nameTitle.value) return;

  const mtl = gsap.timeline();
  const tl = gsap.timeline({ paused: true, repeat: -1 });
  const repeatCount = 11;
  // https://codepen.io/PointC/pen/ZEmOKvP

  split.chars.forEach((obj, i) => {
    const txt = obj.innerText;
    const clone = `<div class="cloneText"> ${txt} </div>`;
    const newHTML = `<div class="originalText pointer-events-none"> ${txt} </div>${clone}`;
    obj.innerHTML = newHTML;
    if (obj.childNodes && obj.childNodes[1]) {
      gsap.set(obj.childNodes[1], {
        yPercent: i % 2 === 0 ? -100 : 100,
      });
      const tween = gsap.to(obj.childNodes, {
        repeat: repeatCount,
        ease: 'none',
        yPercent: i % 2 === 0 ? '+=100' : '-=100',
      });
      tl.add(tween, 0);
    }
  });
  mtl.fromTo(nameTitle.value, { opacity: 0 }, { opacity: 1, duration: 4, delay: 0.3 });
  mtl.to(tl, { progress: 1, duration: 4, ease: 'power4.inOut' }, '');
}
</script>
<style scoped lang="scss">
.p-index {
  .main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    position: relative;
    overflow: hidden; // block x scroll

    .main__title--container {
      position: relative;
      width: 100%;
      left: 1vw; // half size of span with ® (registered mark character)
      top: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__title {
      position: relative;
      font-size: 1.5rem;
      // font-family: 'JosefinSans', sans-serif;
      font-weight: 700;
      bottom: 0;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      white-space: nowrap;

      span {
        display: inline-block;
        position: relative;
        height: 100%;
        color: white;
        -webkit-text-stroke: 0px;

        font-weight: 600;
      }

      &.title-outline {
        z-index: 0;
        -webkit-text-stroke: 2px $main-dark-text;
        color: transparent;

        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -25%);
      }

      &.title-splitted {
        // needed because text added to the document later is
        // not considered of the component scope
        :deep(.char) {
          overflow: hidden;
          position: relative;

          .cloneText {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      }
    }
  }
}
@media (min-width: $lg-breakpoint) {
  .p-index {
    .main {
      // margin-bottom: 50px;
      &__title {
        font-size: min(12.97vw, 30rem);

        span {
          line-height: 12.97vw;
          font-size: 3vw;
          top: -6.5vw;
          left: -3vw;
          font-weight: 100;
        }
      }
    }
  }
}
</style>
