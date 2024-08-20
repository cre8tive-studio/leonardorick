<template>
  <div
    v-if="loaded"
    class="p-index"
  >
    <div class="main lr-section-page flex flex-col items-center justify-end gap-2">
      <h1
        ref="nameTitle"
        class="main__title title-splitted pb-20 xl:pl-10"
      >
        Leonardo Rick
        <span class="registered-icon">®</span>
      </h1>
    </div>

    <div class="lr-section-page lr-section-page-no-paddings relative">
      <LRColorfulTile />
      <div
        class="about-me-text lr-section-page-paddings lr-overlaping-allow-hover relative h-full flex flex-col justify-center gap-4"
      >
        <h1 class="text-4xl">about me</h1>
        <p>
          I'm a selectively skilled Software Engineer with strong focus on frontend development, User Experience and
          impactful digital experiences.
        </p>
      </div>
    </div>

    <div class="lr-section-page recommendations">
      <div
        v-for="recommendation in recommendations"
        :key="recommendation.id"
        class="border border-gray-300 p-4 m-4"
      >
        <p>
          {{ recommendation.id }} -=- {{ recommendation.author?.name }} -=-
          {{ recommendation.author.description }}
        </p>
        <div>
          <ClientOnly>
            <NuxtImg
              v-if="recommendation.authorImage"
              :width="100"
              :height="100"
              :src="recommendation.authorImage"
            />
          </ClientOnly>
          <p>{{ recommendation.recommendation }}</p>
        </div>
      </div>

      <div
        v-for="quote in quotes"
        :key="quote.id"
      >
        {{ quote }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SplitType from 'split-type';
import { gsap } from 'gsap';
import { watchOnce } from '@vueuse/core';
import { useAppStore } from '~/store';
const { loaded, recommendations, quotes } = toRefs(useAppStore());

const nameTitle = ref();
onMounted(() => {
  if (nameTitle.value) {
    animateAndSplitChars();
  } else {
    watchOnce(loaded, async () => {
      await nextTick();
      animateAndSplitChars();
    });
  }
});

function animateAndSplitChars() {
  if (!nameTitle.value) {
    return;
  }
  animateRollingChars(new SplitType('.title-splitted', { types: 'chars' }));
}
function animateRollingChars(split: SplitType) {
  const mtl = gsap.timeline();
  const tl = gsap.timeline({ paused: true, repeat: -1 });
  const repeatCount = 8;
  // https://codepen.io/PointC/pen/ZEmOKvP
  if (split.chars) {
    split.chars.forEach((obj, i) => {
      const txt = obj.innerText;
      const clone = `<div class="cloneText"> ${txt} </div>`;
      const newHTML = `<div class="originalText"> ${txt} </div>${clone}`;
      obj.innerHTML = newHTML;
      gsap.set(obj.childNodes[1], {
        yPercent: i % 2 === 0 ? -100 : 100,
      });
      const tween = gsap.to(obj.childNodes, {
        repeat: repeatCount,
        ease: 'none',
        yPercent: i % 2 === 0 ? '+=100' : '-=100',
      });
      tl.add(tween, 0);
    });

    mtl.fromTo(nameTitle.value, { opacity: 0 }, { opacity: 1, duration: 4, delay: 0.3 });
    mtl.to(tl, { progress: 1, duration: 4, ease: 'power4.inOut' }, '-=4.5');
  }
}
</script>
<style scoped lang="scss">
.p-index {
  .main {
    padding-bottom: 25%;
    &__title {
      position: relative;
      z-index: -1;
      font-size: 1.5rem;
      font-family: 'JosefinSans', sans-serif;
      font-weight: 700;
      bottom: 0;
      letter-spacing: 0.03em;
      text-transform: uppercase;

      span {
        display: inline-block;
        position: relative;
        height: 100%;

        font-weight: 600;
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

  // .about-me-text {
  //   z-index: 1;
  // }
}
@media (min-width: $xl-breakpoint) {
  .p-index {
    .main {
      &__title {
        font-size: 86px;
        line-height: 90px;

        span {
          line-height: 90px;
          font-size: 42px;
          top: -23px;
          left: -14px;
        }
      }
    }
    .about-me-text {
      font-size: 72px;
      line-height: 86px;
      letter-spacing: 0.3rem;
    }
  }
}
</style>
