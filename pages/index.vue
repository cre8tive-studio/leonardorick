<template>
  <template v-if="loaded">
    <div class="main flex items-end justify-center gap-2">
      <h1
        ref="nameTitle"
        class="main__title"
      >
        Leonardo Rick
        <span class="registered-icon">®</span>
      </h1>
    </div>

    <div class="recommendations">
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
  </template>
</template>

<script setup lang="ts">
import SplitType from 'split-type';
import { gsap } from 'gsap';
import { useAppStore } from '~/store';

const { loaded, recommendations, quotes } = toRefs(useAppStore());
const nameTitle = ref();
onMounted(() => {
  const repeatCount = 8;
  const tl = gsap.timeline({ paused: true });
  const split = new SplitType('h1', { types: 'chars' });

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
    gsap.to(tl, { progress: 1, duration: 4, ease: 'power4.inOut' });
  }
});
</script>
<style scoped lang="scss">
.main {
  height: calc(100vh - $header-opened-height);

  &__title {
    font-size: 86px;
    margin-bottom: 120px;
    line-height: 90px;
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
      font-size: 42px;
      font-weight: 600;
      line-height: 90px;
      top: -23px;
      left: -14px;
    }

    // todo remove if shining not used
    //   @keyframes animate {
    //   0% {
    //     background-position: 0px;
    //   }

    //   100% {
    //     background-position: 660px;
    //   }
    // }
    // transition: all 3s ease-in-out;
    // background: linear-gradient(to right, #7a7878 0, white 40%, #7a7878 80%);
    // background-clip: text;
    // -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
    // animation: animate 10s linear infinite;

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
</style>
