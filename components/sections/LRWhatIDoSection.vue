<template>
  <div class="s-LRWhatIDoSection lr-section-page lr-section-page-no-paddings">
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
                  <span class="description-text lr-text-body-1">
                    {{ item.description }}
                  </span>
                </span>
              </div>
              <h2 ref="items">
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
import SplitType from 'split-type';
import { useAppStore } from '~/store';
import type { TitleDescriptionModel } from '~/types/title-description.model';
import { getGeneralsFullText } from '~/utils/parsers/generals.parser';
const { generals } = toRefs(useAppStore());
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

const items = ref<HTMLHeadingElement[]>();
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
</script>

<style scoped lang="scss">
.s-LRWhatIDoSection {
  display: flex;
  flex-direction: column;
  justify-content: center;

  ul {
    width: 100%;
    display: flex;
    flex-direction: column;
    li {
      overflow: hidden; // .description has a width bigger than screen, this blocks the x scroll
      .li-content-wrapper {
        position: relative;

        :deep(.char) {
          // this will affect the speed of the gsap animation as well
          transition: opacity 0.3s $default-ease;
        }

        &:hover {
          .description {
            height: 110%;
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
          letter-spacing: -0.2rem;
        }

        .description {
          position: absolute;
          padding: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 0;
          width: 103vw;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          background-color: rgba($highlight-2, 0.8);
          transition: height 0.5s $default-ease;
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
            max-width: 31rem;
            margin-right: 4.5rem;
          }
        }
      }
    }
  }
}

@media (min-width: $xxxl-breakpoint) {
  .s-LRWhatIDoSection {
    ul {
      li {
        h2 {
          font-size: 13rem;
          line-height: 8rem;
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
          --height: 7rem;
          height: var(--height);
          transition: all 0.5s $default-ease;

          &:hover,
          &:focus {
            height: calc(var(--height) * 2.4);
          }
          .description {
            justify-content: flex-start;

            &-paddings-wrapper {
              margin-top: 4rem;
              text-align: left;
              justify-content: left;
              margin-left: 3rem;
            }
          }
          h2 {
            font-size: 7rem;
            line-height: 5rem;
          }
        }
      }
    }
  }
}

@media (max-width: $sm-breakpoint) {
  .s-LRWhatIDoSection {
    ul li .li-content-wrapper {
      --height: 5rem;

      &:hover,
      &:focus {
        height: calc(var(--height) * 3.5);
      }

      .description-paddings-wrapper {
        margin-top: 1.5rem;
        margin-left: 2rem;
        margin-right: 1rem;
      }

      h2 {
        font-size: 4rem;
        line-height: 2rem;
      }
    }
  }
}
</style>
