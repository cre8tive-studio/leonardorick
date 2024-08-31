<template>
  <div class="s-LRTimelineSection lr-section-page lr-section-page-no-paddings">
    <h1 class="section-h1">{{ $t('history') }}</h1>
    <section class="timeline">
      <div
        v-for="(experience, index) in experiencesContent"
        :key="index"
        :index="index"
        class="timeline-entry"
        @mouseenter="mouseEnterHandler"
        @mouseleave="mouseLeaveHandler"
      >
        <h3 class="time">
          <div class="over-layer over-layer-time" />
          <span>
            {{ experience.year }}
          </span>
        </h3>
        <div class="description">
          <h3 class="description-title">{{ active === index ? experience.funTitle : experience.title }}</h3>
          <div class="over-layer over-layer-description">
            <h3 class>{{ experience.funTitle }}</h3>
            <h4 aria-hidden="true">[hidden]</h4>
          </div>

          <h4>{{ experience.company }}</h4>
        </div>
      </div>
    </section>
    <div class="timeline-footer">
      {{ $t('work_more_information') }}
      <NuxtLink
        target="_blank"
        :to="LINKS.LINKEDIN"
      >
        <SvgoLinkedin />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LINKS } from '~/utils/constants/links';
const active = ref<number>(-1);
function mouseEnterHandler(_e: MouseEvent) {
  // console.log(e.target);
  // active.value = parseInt((e.target as HTMLDivElement).getAttribute('index') || '-1');
}
function mouseLeaveHandler(_e: MouseEvent) {
  // active.value = -1;
}

const experiencesContent = [
  {
    company: 'Unbabel',
    title: 'Software Engineer',
    funTitle: 'Unbabel fun title',
    year: 'now',
  },
  {
    company: 'BySix',
    title: 'Software Development Engineer',
    funTitle: 'Bysix fun title',
    year: '2021',
  },
  {
    company: 'Itaú',
    title: 'Software Engineer',
    funTitle: 'When things started to get serious',
    year: '2020',
  },
  {
    company: 'Itaú',
    title: 'Junior Software Developer',
    funTitle: 'Bla bla bla',
    year: '2019',
  },
  {
    company: 'Itaú',
    title: 'Intern',
    funTitle: 'Just the perfect guy to solve annoying bugs ',
    year: '2018',
  },
];
</script>

<style scoped lang="scss">
.s-LRTimelineSection {
  display: flex;
  flex-direction: column;
  justify-content: center;

  margin-bottom: 10vw;
  h1 {
    padding-inline: var(--lr-side-space);
    margin-bottom: 4rem;
  }

  .timeline-entry {
    // this is the magic that makes the:hover do not select all
    // siblings and only the one on the same level
    display: contents;
  }

  .timeline {
    display: grid;
    grid-template-columns: 1fr 2fr;

    font-size: min(2.5vw, 6rem);
    line-height: min(2.5vw, 6rem);
    letter-spacing: 0.3rem;

    .time,
    .description {
      display: flex;
      position: relative;
      align-items: center;
      padding-inline: 1rem;
      height: 8rem;

      &:has(~ .description:hover) {
        .over-layer {
          transform: scaleY(1);
        }
      }
      &:hover {
        + .description {
          .over-layer {
            transform: scaleY(1);
          }

          .description-title {
            opacity: 0;
          }
        }

        .over-layer {
          transform: scaleY(1);
        }
        .description-title {
          opacity: 0;
        }
      }
    }

    .time {
      display: flex;
      text-transform: uppercase;
      padding-left: var(--lr-side-space);
      border-bottom: 1px solid $blue-3;
      span {
        position: relative;
      }
    }

    .description {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      padding-right: var(--lr-side-space);
      border-bottom: 1px solid $blue-3;

      .description-title {
        position: relative;
        margin-bottom: 1rem;
        transition: opacity 0.3s $default-ease;
      }

      h4 {
        @extend .lr-text-body-1;
        position: relative;
        color: $main-dark-text-dark;
      }
    }
    .over-layer {
      position: absolute;
      top: 0;
      left: 0;
      overflow: hidden;
      transform: scaleY(0);
      width: 100%;
      height: 100%;
      padding-inline: 1rem;
      background-color: rgba($highlight-2, 0.9);
      transition: transform 0.3s $default-ease;

      &-time {
        display: flex;
        align-items: center;
        padding-left: var(--lr-side-space);
      }

      &-description {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        h3 {
          margin-bottom: 1rem;
        }
        h4 {
          visibility: hidden;
        }
      }
    }
  }

  .timeline-footer {
    padding-inline: var(--lr-side-space);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 2rem;
    color: $main-dark-text-darker;
    a {
      padding: 1rem;
      padding-right: 0;
      &:hover {
        color: $main-dark-text;
      }

      svg {
        transition: color 0.3s $default-ease;
        height: 20px;
        width: 20px;
        cursor: pointer;
      }
    }
  }
}
</style>
