<template>
  <div class="main lr-section-page">
    <div
      ref="mainTitleContainer"
      class="main__title--container"
    >
      <h1
        ref="nameTitle"
        class="main__title title-splitted title-filled"
      >
        {{ nameText }}
        <span class="registered-icon">®</span>
      </h1>
      <h1
        ref="nameTitleOutline"
        aria-hidden="true"
        class="main__title title-splitted title-outline"
      >
        {{ nameText }}
        <span class="registered-icon">®</span>
      </h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/store';
import SplitType from 'split-type';
import { gsap } from 'gsap';
import { watchOnce } from '@vueuse/core';
import { SCROLL_TRIGGER_IDS } from '~/utils/constants/scroll-trigger-ids';
import { ScrollTrigger } from 'gsap/all';

const { loaded, personalInfo } = toRefs(useAppStore());
const mainTitleContainer = ref<HTMLDivElement>();
const nameTitle = ref<HTMLDivElement>();
const nameTitleOutline = ref<HTMLDivElement>();

const nameText = computed(() => personalInfo.value?.name || '');

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

function runAnimations() {
  animateTitleOverflow();
  animateTitleRollingChars();
}

function animateTitleOverflow() {
  if (!nameTitle.value || !nameTitleOutline.value) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      id: SCROLL_TRIGGER_IDS.NAME_MAIN_TEXT,
      trigger: '.main',
      start: 'top top',
      end: () => window.innerWidth * 0.094,
      pin: nameTitle.value,
      scrub: true,
    },
  });

  tl.to(nameTitle.value, {
    scale: 0.95,
  });

  tl.to(
    nameTitleOutline.value,
    {
      scale: 0.95,
    },
    '<'
  );
}

onUnmounted(() => {
  ScrollTrigger.getById(SCROLL_TRIGGER_IDS.NAME_MAIN_TEXT)?.kill(true);
});

function animateTitleRollingChars() {
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

    &.title-filled {
      text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3), 3px 3px 15px rgba(255, 255, 255, 0.4);
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

@media (min-width: $lg-breakpoint) {
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
</style>
