<template>
  <div
    ref="section"
    class="s-LRCompetencesSection lr-section-page"
  >
    <div
      ref="mainContainer"
      class="main-container"
    >
      <LRWorkClock
        :containers-query="'.phrase-scroll-marker'"
        :base-height="BASE_HEIGHT"
        :should-pin="shouldPin"
        @set-container-height="setContainerHeight"
      />
      <div
        v-for="competence in COMPETENCES"
        :key="competence.name"
        class="orbit"
        :data-icon="competence.name"
      >
        <div class="floating-icon-wrapper">
          <component
            :is="competence.icon"
            filled
          />
        </div>
      </div>
    </div>
    <div v-if="shouldPin">
      <div
        v-for="index of containersCount"
        :key="index"
        ref="phraseScrollMarkers"
        class="phrase-scroll-marker"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import type { CompetenceNameOptions } from '~/types/competences.model';
import { COMPETENCES } from '~/utils/constants/competences';
import { SCROLL_TRIGGER_IDS } from '~/utils/constants/scroll-trigger-ids';

const BASE_HEIGHT = 90;
const section = ref<HTMLDivElement>();
const mainContainer = ref<HTMLDivElement>();
const phraseScrollMarkers = ref<HTMLDivElement[] | undefined>();
const containersCount = ref(0);

const { isMobile } = useDevice();

const shouldPin = computed(() => !isMobile);

onMounted(() => {
  /**
   * sticky main content on view until the whole wrapper is out of screen
   */
  if (shouldPin.value) {
    ScrollTrigger.create({
      id: SCROLL_TRIGGER_IDS.COMPETENECES_PIN,
      trigger: '.s-LRCompetencesSection',
      pin: mainContainer.value,
      start: 'top top',
      end: 'bottom bottom',
    });
  }

  /**
   * timeline for
   * 1) big bang entering (scroll trigger)
   * 2) orbit effect on each icon
   */
  const tl = gsap.timeline({
    paused: true,
    scrollTrigger: {
      id: SCROLL_TRIGGER_IDS.COMPETENECES_TIMELINE,
      trigger: '.s-LRCompetencesSection',
      start: 'top center+=5%',
    },
  });

  const orbits = gsap.utils.toArray('.orbit');
  /**
   * animate big bang entering
   */
  orbits.forEach((el, index) => {
    const element = el as HTMLElement;
    const wrapper = element.querySelector('.floating-icon-wrapper');
    const name = getName(element);
    const competence = COMPETENCES[name];

    gsap.set(element, { scale: 0 });
    gsap.set(wrapper, { backgroundColor: competence.background });
    tl.to(
      element,
      {
        translateX: competence.position.x,
        translateY: competence.position.y,
        ease: 'power4.out',
        duration: 0.9,
      },
      index ? '<+=0.05' : ''
    );
    tl.to(element, { scale: 1, ease: 'power4.out', duration: 0.9 }, '<');
  });

  /**
   * animate orbit effect
   */
  orbits.forEach((el, index) => {
    const element = el as HTMLElement;
    const wrapper = element.querySelector('.floating-icon-wrapper');
    const name = getName(element);
    const competence = COMPETENCES[name];

    const rotationOffset = competence.rotationOffset || 0;

    // aproximate the yPercent of 0 to reduce the orbit radius
    gsap.set(wrapper, { xPercent: 0, yPercent: -35, x: 0, y: 0 });
    if (rotationOffset) {
      gsap.set(element, { rotation: rotationOffset * competence.direction });
      gsap.set(wrapper, { rotation: rotationOffset * competence.direction * -1 });
    }

    tl.to(
      element,
      {
        rotation: (360 + rotationOffset) * competence.direction,
        ease: 'none',
        repeat: -1,
        duration: 18 + (competence.durationOffset || 0),
      },
      ''
    );
    tl.to(
      wrapper,
      {
        rotation: (360 + rotationOffset) * competence.direction * -1,
        ease: 'none',
        repeat: -1,
        duration: 18 + (competence.durationOffset || 0),
      },
      index ? '<' : ''
    );
  });
});

onUnmounted(() => {
  ScrollTrigger.getById(SCROLL_TRIGGER_IDS.COMPETENECES_PIN)?.kill(true);
  ScrollTrigger.getById(SCROLL_TRIGGER_IDS.COMPETENECES_TIMELINE)?.kill(true);
});

async function setContainerHeight(count: number, max: number) {
  if (!section.value || !shouldPin.value) return;

  // the container hight is always fixed on the maxium size plus a offset so it doesn't
  // end right exactly when the text in the middle fniishes
  const offset = BASE_HEIGHT - 30;
  section.value.style.setProperty('height', `${BASE_HEIGHT * max + offset}svh`);

  containersCount.value = count;
  await nextTick();
  if (!phraseScrollMarkers.value) return;
  for (const container of phraseScrollMarkers.value) {
    container.style.setProperty('height', `${BASE_HEIGHT}svh`);
  }
}

function getName(element: HTMLElement): CompetenceNameOptions {
  return (element.getAttribute('data-icon') || 'vue') as CompetenceNameOptions;
}
</script>

<style scoped lang="scss">
.s-LRCompetencesSection {
  display: flex;
  margin-bottom: 10vh;

  .phrase-scroll-marker:not(.main-container) {
    // uncomment border to understand markers of each line on LRWorkCLock
    // border: 2px solid yellow;
    margin-bottom: 5px;
    width: 0px;
  }

  .main-container {
    container-type: size;
    height: 100svh;
    flex-grow: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    .orbit {
      position: absolute;
      --size: clamp(3rem, 4vw, 15rem);
      .floating-icon-wrapper {
        background-color: $main-dark-text;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.4rem;
        height: var(--size);
        width: var(--size);
        position: relative;
        border-radius: 27%;

        -webkit-box-shadow: -16px 9px 149px -0px rgba($highlight, 0.35);
        -moz-box-shadow: -16px 9px 149px -0px rgba($highlight, 0.35);
        box-shadow: -16px 9px 149px -0px rgba($highlight, 0.35);

        svg {
          height: 80%;
          width: 80%;
          position: relative;
        }
      }
      &[data-icon='vue'] svg {
        top: 5px;
      }
      &[data-icon='threejs'] svg {
        top: 3px;
        left: 3px;
      }
    }
  }
}
</style>
