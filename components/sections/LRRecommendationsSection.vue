<template>
  <div class="s-LRRecommendationsSection lr-section-page lr-section-page-no-paddings">
    <h1 class="lr-section-page-paddings section-h1">{{ $t('what_they_said') }}</h1>
    <div class="lr-section-page-paddings recommendations">
      <div class="quote-col">
        <div
          v-for="(recommendation, index) in recommendations"
          :key="recommendation.id"
          class="recommendation"
          :lr-index="index"
        >
          <div class="content">
            <b aria-hidden="true">“</b>
            <div class="text-content">
              <p :class="`recommendation-text recommendation-text-${index}`">
                <span class="lr-fade-opacity">
                  {{ recommendation.recommendation }}
                </span>
              </p>

              <p class="author">
                {{ recommendation.author?.name }}
              </p>
              <p class="author-description">
                {{ recommendation.author.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="images-col-container">
        <div class="images-col-wrapper">
          <div class="images-col">
            <div
              v-for="recommendation in recommendations"
              :key="recommendation.id"
              class="img-wrapper"
            >
              <ClientOnly>
                <NuxtImg
                  v-if="recommendation.authorImage"
                  :width="100"
                  :height="100"
                  :src="recommendation.authorImage"
                />
              </ClientOnly>
            </div>
            <div
              ref="arrow"
              class="arrow"
            />
          </div>
        </div>

        <div
          v-for="index in recommendations.length - 1"
          :key="index"
          :class="`images-col-wrapper images-col-wrapper-${index + 1}`"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useAppStore } from '~/store';
import { SCROLL_TRIGGER_IDS } from '~/utils/constants/scroll-trigger-ids';

const arrow = ref<HTMLDivElement>();
const { recommendations } = toRefs(useAppStore());
let scrollTriggers: ScrollTrigger[];

onMounted(() => {
  /**
   * animate stickying the images at the right side column
   */
  ScrollTrigger.create({
    id: SCROLL_TRIGGER_IDS.RECOMMENDATIONS_PIN_IMAGE,
    trigger: '.images-col',
    endTrigger: '.s-LRRecommendationsSection',
    pin: '.images-col',
    start: 'center center',
    pinSpacing: false,
    end: 'bottom bottom',
  });

  /**
   * animate left arrow that points to the quote
   */
  scrollTriggers = ScrollTrigger.batch('.recommendation', {
    start: 'top 50%',
    onEnter: (_targets, triggers) => {
      const index = parseInt(triggers[0]?.trigger?.getAttribute('lr-index') || '0');
      if (!index || !arrow.value) return;

      gsap.to(arrow.value, { y: getImageWrapperHeight() * index });
      gsap.to('.img-wrapper', { opacity: 0.3, scale: 0.9 });
      gsap.to(`.img-wrapper:nth-child(${index + 1})`, { opacity: 1, scale: 1 });
    },
    onLeaveBack: (_targets, triggers) => {
      const index = parseInt(triggers[0]?.trigger?.getAttribute('lr-index') || '0');
      if (!index || !arrow.value) return;

      gsap.to(arrow.value, { y: getImageWrapperHeight() * (index - 1) });
      gsap.to('.img-wrapper', { opacity: 0.3, scale: 0.9 });
      gsap.to(`.img-wrapper:nth-child(${index})`, { opacity: 1, scale: 1 });
    },
  });
});

onUnmounted(() => {
  ScrollTrigger.getById(SCROLL_TRIGGER_IDS.RECOMMENDATIONS_PIN_IMAGE)?.kill(true);
  for (const trigger of scrollTriggers) {
    trigger.kill(true);
  }
});

function getImageWrapperHeight() {
  const imageWrapper = document.querySelector('.img-wrapper');
  const imageCol = document.querySelector('.images-col');
  if (!imageWrapper || !imageCol) return 0;
  return imageWrapper.clientHeight + parseFloat(getComputedStyle(imageCol).gap);
}
</script>

<style scoped lang="scss">
.s-LRRecommendationsSection {
  display: flex;
  flex-direction: column;
  height: fit-content;

  --container-margin-top: clamp(4rem, 4vw, 20rem);

  .recommendations {
    min-height: 100svh;
    flex: 1;
    display: flex;
    justify-content: space-between;
    gap: clamp(1.8rem, 6vw, 16rem);
    margin-top: var(--container-margin-top);
    max-width: clamp(40rem, 85vw, 200rem);
    position: relative;

    .quote-col {
      @extend .lr-text--body-2;
      display: flex;
      flex-direction: column;

      .recommendation {
        border-bottom: 1px solid $blue-3;
        flex: 1;
        display: flex;
        align-items: center;

        &:first-child {
          border-top: 1px solid $blue-3;
        }
        &:not(:first-child) {
          .lr-fade-opacity {
            --lr-fade-opacity-animation-start: 39vh;
            --lr-fade-opacity-animation-end: 80vh;
          }
        }

        .content {
          display: flex;
          gap: clamp(0.2rem, 1vw, 1rem);
          padding-block: clamp(2rem, 2vh, 4rem);
          b {
            height: 100%;
            font-size: clamp(3.5rem, 8vw, 14rem);
            line-height: clamp(2.5rem, 6vw, 12rem);
            color: $highlight;
          }
          .text-content {
            display: flex;
            flex-direction: column;

            .recommendation-text {
              margin-bottom: clamp(1.2rem, 5vw, 3rem);
            }
            .author {
              @extend .lr-text--body-1;
            }
            .author-description {
              @extend .lr-text--label-1;
              color: $main-dark-text-dark;
            }
          }
        }
      }
    }

    .images-col-container {
      --min-image-size: 4.5rem;
      --image-size: clamp(var(--min-image-size), 7vw, 30rem);
      --image-space: clamp(1rem, 4vw, 35rem);
      --margin-top: calc(var(--container-margin-top) + var(--image-size) / 2);

      position: relative;
      min-width: var(--min-image-size);
      border: 2px solid transparent;
      display: flex;
      flex-direction: column;
      margin-top: var(--margin-top);

      .images-col-wrapper {
        position: relative;
        flex: 1;

        .images-col {
          width: 100% !important; // to avoid gsap changing it :p
          position: absolute;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: var(--image-space);

          .arrow {
            --height: clamp(0.8rem, 1.2vw - 0.3rem, 3rem);
            position: absolute;
            border-top: var(--height) solid transparent;
            border-bottom: var(--height) solid transparent;
            border-right: var(--height) solid $highlight;
            left: calc(var(--image-size) / 3 * -1);
            top: calc(
              var(--image-size) / 2 - var(--height)
            ); // height if the imgage divided by 2 minus the arrow height
          }

          .img-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            width: var(--image-size);
            height: var(--image-size);
            min-height: var(--image-size);
            border-radius: 50%;
            overflow: hidden;
            opacity: 0.3;
            scale: 0.8;
            &:first-child {
              opacity: 1;
              scale: 1;
            }

            img {
              height: 100%;
              width: 100%;
              object-fit: cover;
              filter: grayscale(1) contrast(1.2);
            }
          }
        }
      }
    }
  }
}
</style>
