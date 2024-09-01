<template>
  <div class="s-LRCompetencesSection lr-section-page">
    <LRWorkClock />
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
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import type { CompetenceNameOptions } from '~/types/competences.model';
import { COMPETENCES } from '~/utils/constants/competences';

onMounted(() => {
  const tl = gsap.timeline({
    paused: true,
    scrollTrigger: {
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

    const roffset = competence.rotationOffset || 0;

    // aproximate the yPercent of 0 to reduce the orbit radius
    gsap.set(wrapper, { xPercent: 0, yPercent: -35, x: 0, y: 0 });
    if (roffset) {
      gsap.set(element, { rotation: roffset * competence.direction });
      gsap.set(wrapper, { rotation: roffset * competence.direction * -1 });
    }

    tl.to(
      element,
      {
        rotation: (360 + roffset) * competence.direction,
        ease: 'none',
        repeat: -1,
        duration: 18 + (competence.durationOffset || 0),
      },
      ''
    );
    tl.to(
      wrapper,
      {
        rotation: (360 + roffset) * competence.direction * -1,
        ease: 'none',
        repeat: -1,
        duration: 18 + (competence.durationOffset || 0),
      },
      index ? '<' : ''
    );
  });
});

function getName(element: HTMLElement): CompetenceNameOptions {
  return (element.getAttribute('data-icon') || 'vue') as CompetenceNameOptions;
}
</script>

<style scoped lang="scss">
.s-LRCompetencesSection {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  // &.lr-section-page {
  //   height: 600vh;
  //   border: 2px solid red;
  // }

  .orbit {
    position: absolute;
    .floating-icon-wrapper {
      background-color: $main-dark-text;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.4rem;
      height: 84px;
      width: 84px;
      position: relative;
      border-radius: 24px;

      -webkit-box-shadow: -16px 9px 149px -0px rgba($highlight, 0.35);
      -moz-box-shadow: -16px 9px 149px -0px rgba($highlight, 0.35);
      box-shadow: -16px 9px 149px -0px rgba($highlight, 0.35);

      svg {
        height: 64px;
        width: 64px;
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
</style>
