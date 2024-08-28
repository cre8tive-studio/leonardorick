<template>
  <div class="s-LRWhatIDoSection what-i-do lr-section-page lr-section-page-no-paddings">
    <h1 class="lr-section-page-paddings section-h1">What I do</h1>
    <div class="flex">
      <ul>
        <li
          v-for="(item, index) in content"
          :key="index"
        >
          <div class="li-content-wrapper">
            <div class="description">
              <span class="description-paddings-wrapper">
                <span class="description-text">
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
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import SplitType from 'split-type';

const content = [
  {
    title: 'Frontend',
    description:
      'My main work is here, bla bla bal. Since the specs of the product until shipping and monitoriing, and more and more and more ',
  },
  {
    title: 'Product',
    description: 'something2',
  },
  {
    title: 'Fullstack',
    description: 'something3',
  },
  {
    title: '3D',
    description: 'something4',
  },
];
const items = ref<HTMLHeadingElement[]>();
onMounted(() => {
  if (!items.value || !items.value.length) return;
  for (const li of items.value) {
    const text = new SplitType(li, { types: 'chars' });

    gsap.killTweensOf(text.chars);
    gsap.from(text.chars, {
      scrollTrigger: {
        trigger: li,
        start: 'bottom bottom',
        end: 'top 42%',
        scrub: true,
        markers: false,
      },
      opacity: 0.3,
      stagger: 0.2,
    });
  }
});
</script>

<style scoped lang="scss">
.s-LRWhatIDoSection {
  ul {
    width: 100%;
    display: flex;
    flex-direction: column;
    li {
      .li-content-wrapper {
        position: relative;
        &:hover {
          .description {
            height: 100%;
          }
        }

        h2 {
          @extend .lr-section-page-paddings;
          position: relative;
          text-transform: uppercase;
          font-weight: 600;
          width: 100%;
          letter-spacing: -0.2rem;

          &:hover,
          & + .description:hover {
            :deep(.char) {
              transition: opacity 0.5s $default-ease; // keep it inside the hover to not affect gsap
              opacity: 1 !important;
            }
          }
        }
        .description {
          position: absolute;
          padding: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 0;
          width: 100%;
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
            top: 0;
            max-width: 35rem;
          }
        }
      }
    }
  }
}
@media (min-width: 1580px) {
  .s-LRWhatIDoSection {
    ul {
      li {
        h2 {
          font-size: 9rem;
          line-height: 5.5rem;
        }
      }
    }
  }
}

@media (max-width: 1580px) {
  .s-LRWhatIDoSection {
    ul {
      li {
        .li-content-wrapper {
          --height: 7rem;
          height: var(--height);
          transition: all 0.5s $default-ease;

          &:hover,
          &:focus {
            height: calc(var(--height) * 2);
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
            line-height: 5.5rem;
          }
        }
      }
    }
  }
}

@media (max-width: $sm-breakpoint) {
  .s-LRWhatIDoSection {
    ul li .li-content-wrapper h2 {
      font-size: rem;
      line-height: 5.5rem;
    }
  }
}
</style>
