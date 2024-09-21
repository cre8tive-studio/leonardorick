<template>
  <div
    id="what-i-do"
    class="s-LRWhatIDoSection lr-section-page lr-section-page-no-paddings"
  >
    <div class="flex flex-col gap-4">
      <h1 class="lr-section-page-paddings section-h1">{{ whatIDoTItle?.title }}</h1>
      <div class="flex">
        <ul>
          <li
            v-for="item in whatIdoContent"
            :key="item.id"
          >
            <div class="li-content-wrapper">
              <div class="description">
                <span class="description-paddings-wrapper">
                  <span class="description-text lr-text--body-1">
                    {{ item.description }}
                  </span>
                </span>
              </div>
              <h2
                :id="`${item.id}`"
                ref="items"
              >
                {{ item.title }}
              </h2>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import SplitType from 'split-type';
import { useAppStore } from '~/store';
import type { TitleDescriptionModel } from '~/types/title-description.model';
import { SCROLL_TRIGGER_IDS } from '~/utils/constants/scroll-trigger-ids';
import { getGeneralsFullText } from '~/utils/parsers/generals.parser';

const { generals } = toRefs(useAppStore());
const items = ref<HTMLHeadingElement[]>();

const whatIDoList = computed(() => generals.value.find((general) => general.key === 'what-i-do')?.data || []);

const whatIDoTItle = computed(
  () =>
    [whatIDoList.value.find((item) => item.htmlTag === 'h1')].map((item) => ({
      id: item?.id,
      title: getGeneralsFullText(item),
    }))[0]
);

const whatIdoContent = computed(() =>
  whatIDoList.value.reduce((acum, curr, index) => {
    if (curr.htmlTag === 'h2') {
      acum.push({
        id: curr.id,
        title: getGeneralsFullText(curr),
        description: getGeneralsFullText(whatIDoList.value[index + 1]),
      });
    }
    return acum;
  }, [] as TitleDescriptionModel[])
);

onMounted(() => {
  if (!items.value || !items.value.length) return;
  for (const li of items.value) {
    const text = new SplitType(li, { types: 'chars' });

    gsap.killTweensOf(text.chars);
    gsap.fromTo(
      text.chars,
      {
        opacity: 0.3,
      },
      {
        scrollTrigger: {
          id: getScrollerId(li.id),
          trigger: li,
          start: 'top bottom',
          end: 'top 40%',
          scrub: true,
        },
        opacity: 1,
        stagger: 0.2,
      }
    );
  }
});

onUnmounted(() => {
  if (!whatIdoContent.value) return;
  for (const item of whatIdoContent.value) {
    ScrollTrigger.getById(getScrollerId(String(item.id)))?.kill(true);
  }
});

function getScrollerId(id?: string) {
  return `${SCROLL_TRIGGER_IDS.WHAT_I_DO}-${id}`;
}
</script>

<style scoped lang="scss">
.s-LRWhatIDoSection {
  display: flex;
  flex-direction: column;
  justify-content: center;

  margin-bottom: 5svh;

  ul {
    width: 100%;
    display: flex;
    flex-direction: column;
    li {
      .li-content-wrapper {
        position: relative;
        --height: clamp(4.5rem, 9vw, 16rem);
        height: var(--height);

        transition: all 0.8s $default-ease;

        :deep(.char) {
          // this will affect the speed of the gsap animation as well
          transition: opacity 0.3s $default-ease;
        }

        &:hover {
          // add different transition on hover to close it faster than it opens
          transition: all 0.4s $default-ease;
          .description {
            transition: all 0.4s $default-ease;
            height: 140%;
          }

          :deep(.char) {
            opacity: 1 !important;
          }
        }

        h2 {
          @extend .lr-section-page-paddings;
          position: relative;
          text-transform: uppercase;
          font-weight: 600;
          width: 100%;
          font-size: clamp(4rem, 10vw, 20rem);
          line-height: clamp(4.5rem, 8.5vw, 16rem);
        }

        .description {
          position: absolute;
          padding: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 0;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          background-color: rgba($highlight-2, 0.8);
          transition: height 0.8s $default-ease;
          overflow: hidden;

          @extend .lr-section-page-paddings;
          &-paddings-wrapper {
            @extend .lr-section-page-paddings;
            position: relative;
            width: 100%;
            max-height: 100%;
            text-align: right;
            display: flex;
            justify-content: right;
          }
          &-text {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            max-width: clamp(32rem, 20vw, 45rem);
            // max-width: clamp(33rem, 25vw, 50rem);
          }
        }
      }
    }
  }
}

@media (max-width: $xxxl-breakpoint) {
  .s-LRWhatIDoSection {
    ul {
      li {
        .li-content-wrapper {
          &:hover,
          &:focus {
            height: calc(var(--height) * 3);
            .description {
              height: 100%;
            }
          }
          .description {
            justify-content: flex-start;

            &-paddings-wrapper {
              margin-top: 5rem;
              text-align: left;
              justify-content: left;
              margin-left: 3rem;
            }
            &-text {
              margin-right: 4.5rem;
            }
          }
        }
      }
    }
  }
}

@media (max-width: $sm-breakpoint) {
  .s-LRWhatIDoSection {
    ul li .li-content-wrapper {
      &:hover,
      &:focus {
        height: calc(var(--height) * 4.3);
      }

      .description-paddings-wrapper {
        margin-top: 2rem;
        margin-left: 2rem;
        margin-right: 1rem;
      }
    }
  }
}
</style>
