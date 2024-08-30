<template>
  <div class="s-LRRecommendations lr-section-page lr-section-page-no-paddings">
    <h1 class="lr-section-page-paddings section-h1">What they said</h1>
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
                {{ recommendation.recommendation }}
              </p>

              <p class="author">
                {{ recommendation.author?.name }}
              </p>
              <p class="author author-description">
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
            ></div>
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

const arrow = ref<HTMLDivElement>();
const { recommendations } = toRefs(useAppStore());

onMounted(() => {
  ScrollTrigger.create({
    trigger: '.s-LRRecommendations',
    pin: '.images-col',
    start: 'top top',
    pinSpacing: false,
    end: 'bottom bottom',
  });

  ScrollTrigger.batch('.recommendation', {
    start: 'top 45%',
    onEnter: (_targets, triggers) => {
      const index = parseInt(triggers[0]?.trigger?.getAttribute('lr-index') || '0');
      if (!index || !arrow.value) return;

      gsap.to(arrow.value, { yPercent: 490 * index });
      gsap.to('.img-wrapper', { opacity: 0.3, scale: 0.9 });
      gsap.to(`.img-wrapper:nth-child(${index + 1})`, { opacity: 1, scale: 1 });
    },
    onLeaveBack: (_targets, triggers) => {
      const index = parseInt(triggers[0]?.trigger?.getAttribute('lr-index') || '0');
      if (!index || !arrow.value) return;

      gsap.to(arrow.value, { yPercent: 490 * (index - 1) });
      gsap.to('.img-wrapper', { opacity: 0.3, scale: 0.9 });
      gsap.to(`.img-wrapper:nth-child(${index})`, { opacity: 1, scale: 1 });
    },
  });
});
</script>

<style scoped lang="scss">
.s-LRRecommendations {
  display: flex;
  flex-direction: column;
  position: relative;

  --height: calc(70vh);
  position: relative;
  &.lr-section-page {
    height: calc(var(--height) * 3);
  }

  .section-h1 {
    position: absolute;
    margin-bottom: 0;
  }

  .recommendations {
    flex: 1;
    display: flex;
    justify-content: space-between;
    gap: 8rem;
    margin-top: 6rem;
    max-width: 165rem;

    .quote-col {
      font-size: min(3vw, 6rem);
      line-height: min(3vw, 6rem);
      letter-spacing: 0.3rem;
      display: flex;
      flex-direction: column;

      .recommendation {
        border-bottom: 1px solid $blue-3;
        flex: 1;
        display: flex;
        align-items: center;
        max-height: 1000px;

        &:first-child {
          border-top: 1px solid $blue-3;
        }

        .content {
          display: flex;
          gap: 1rem;
          b {
            height: 100%;
            font-size: 12rem;
            line-height: 10rem;
            color: $highlight;
          }
          .text-content {
            display: flex;
            flex-direction: column;

            .recommendation-text {
              margin-bottom: 3rem;
            }
            .author {
              font-size: 1rem;
              line-height: 1.8rem;
            }
            .author-description {
              opacity: 0.5;
            }
          }
        }
      }
    }

    .images-col-container {
      position: relative;
      height: 100%;
      min-width: 10rem;
      border: 2px solid transparent;
      display: flex;
      flex-direction: column;

      .images-col-wrapper {
        position: relative;
        flex: 1;
        display: flex;
        align-items: center;

        .images-col {
          width: 100% !important; // to avoid gsap changing it :p
          position: absolute;
          .arrow {
            position: absolute;
            border-top: 15px solid transparent;
            border-bottom: 15px solid transparent;
            border-right: 15px solid $highlight;
            top: 0;
            left: -40px;
            top: calc(8rem / 2 - 1rem); // height if the imgage divided by 2 minus the .img-wrapper border
          }

          .img-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
            width: 8rem;
            height: 8rem;
            border-radius: 50%;
            overflow: hidden;
            opacity: 0.3;
            scale: 0.9;
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
