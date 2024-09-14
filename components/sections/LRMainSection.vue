<template>
  <div
    ref="mainSection"
    class="s-LRMainSection lr-section-page lr-section-page-no-paddings"
  >
    <div class="title--container">
      <h1
        ref="nameTitle"
        class="title title-splitted title-filled"
      >
        <span class="main">{{ nameText }}</span>
        <span class="registered-icon">®</span>
      </h1>
      <h1
        ref="nameTitleOutline"
        aria-hidden="true"
        class="title title-splitted title-outline"
      >
        <span class="main">{{ nameText }}</span>
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
const mainSection = ref<HTMLDivElement>();
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
  animateTitleRollingChars();
  // starting both animations at the same time was
  // causing some flickering on the pinning. since 100ms
  // is not pereceptive for this scenario, we add this solid
  // value to ensure initial needed value for pinning are available.
  // I already tried delaying the timeline but with no succsss. Timeout
  // should work well
  setTimeout(() => animateTitleOverflow(), 100);
}

function animateTitleOverflow() {
  if (!nameTitle.value || !nameTitleOutline.value) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      id: SCROLL_TRIGGER_IDS.NAME_MAIN_TEXT,
      trigger: mainSection.value,
      start: 'top top',
      end: () => (mainSection.value?.offsetWidth || 0) * 0.095,
      pin: nameTitle.value,
      scrub: true,
    },
    delay: 1,
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
.s-LRMainSection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;

  .title--container {
    position: relative;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .title {
    position: relative;
    bottom: 0;
    font-size: clamp(2rem, 12.6vw, 28rem);
    line-height: clamp(5.4rem, 19.5vw, 46rem);
    font-weight: 700;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    white-space: nowrap;

    .registered-icon {
      font-size: 0.3em;
      line-height: 1em;
      height: 100%;
      font-weight: 100;

      position: relative;
      top: max(-11vw, -25rem);

      // make it work on the outline
      -webkit-text-stroke: 0px;
      color: $main-dark-text;
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
</style>
