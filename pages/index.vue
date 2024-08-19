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

    <div class="lr-section-page quotes">
      <!-- <div class="flex items center justify-center">text</div> -->
      <div class="quotes-container flex flex-wrap">
        <div
          v-for="index in 370"
          :key="index"
          class="square"
        ></div>
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
      z-index: -1;
      font-size: 1.5rem;
      font-family: 'JosefinSans', sans-serif;
      font-weight: 700;
      position: relative;
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

  // todo move to a component
  .quotes {
    padding: 0;
    perspective: 2000px;
    overflow: hidden;
    border-top: 3px solid $secoundary-dark-bg;
    border-bottom: 3px solid $secoundary-dark-bg;

    .quotes-container {
      z-index: -2;
      position: absolute;
      // position: relative;
      width: 110%;
      height: 110%;

      top: -300px;
      left: -200px;
      background-color: rgba($main-dark-bg, 0.7);
      opacity: 0.7;

      transform: rotateX(50deg) rotateY(-5deg) rotateZ(20deg) scale(1.25);

      &:after,
      &:before {
        content: '';
        position: absolute;
        inset: 0px;
        pointer-events: none;
      }

      &:before {
        // z-index: 2;
        background-image: url('~/assets/icons/plus-pattern-center.webp');
        background-size: 144px;
        background-repeat: repeat;
        opacity: 0.15;
      }
      .square {
        min-width: 4.5rem;
        min-height: 4.5rem;
        border: 1px solid rgba($main-dark-text, 0.25);

        transition-duration: 1500ms;
        &:hover {
          transition-duration: 0ms;
          &:nth-child(4n) {
            background-color: $blue-2;
          }
          &:nth-child(4n + 1) {
            background-color: $blue-3;
          }
          &:nth-child(4n + 2) {
            background-color: $blue-4;
          }
          &:nth-child(4n + 3) {
            background-color: $blue-5;
          }

          &:nth-child(7n) {
            background-color: $blue-2;
          }

          &:nth-child(7n + 3) {
            background-color: $blue-3;
          }

          &:nth-child(7n + 5) {
            background-color: $blue-4;
          }

          &:nth-child(7n + 6) {
            background-color: $blue-5;
          }

          &:nth-child(11n + 1) {
            background-color: $blue-5;
          }

          &:nth-child(11n + 4) {
            background-color: $blue-2;
          }

          &:nth-child(11n + 7) {
            background-color: $blue-3;
          }

          &:nth-child(11n + 10) {
            background-color: $blue-4;
          }
        }
      }
    }
  }
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
  }
}
</style>
