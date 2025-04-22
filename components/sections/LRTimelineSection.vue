<template>
  <div
    id="history"
    class="s-LRTimelineSection lr-section-page lr-section-page-no-paddings"
  >
    <h1 class="section-h1">{{ $t('history') }}</h1>
    <section class="timeline">
      <div
        v-for="(experience, index) in experiences"
        :key="index"
        :index="index"
        class="timeline-entry"
      >
        <h3 class="time">
          <div class="overlay overlay-time" />
          <span>
            {{ experience.year }}
          </span>
        </h3>
        <div class="description">
          <h3 class="description-title">{{ experience.title }}</h3>
          <div class="overlay overlay-description">
            <h3 class>{{ experience.funTitle }}</h3>
            <h4 aria-hidden="true">[hidden]</h4>
          </div>

          <div class="company">
            <ClientOnly>
              <NuxtLink
                lr-cursor
                :to="experience.company.site"
                target="_blank"
              >
                <NuxtImg
                  v-if="experience.companyImage"
                  :src="experience.companyImage"
                  :alt="`${experience.company.name} company image`"
                />
              </NuxtLink>
            </ClientOnly>
            <h4>{{ experience.company.name }}</h4>
          </div>
        </div>
      </div>
    </section>
    <div class="timeline-footer">
      {{ $t('work_more_information') }}
      <NuxtLink
        class="simple-action-button"
        lr-cursor
        target="_blank"
        :to="linkedinUrl"
      >
        <SvgoLinkedin />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/store';

const { personalInfo, experiences } = toRefs(useAppStore());

const linkedinUrl = computed(() => personalInfo.value?.links.linkedin || '');
</script>

<style scoped lang="scss">
.s-LRTimelineSection {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: fit-content;
  min-height: 100svh;
  margin-bottom: 10vh;

  h1 {
    padding-inline: var(--lr-side-space);
    margin-bottom: 4rem;
  }

  .timeline-entry {
    // this is the magic that makes the:hover do not select all
    // siblings and only the one on the same level. It's basicaly the nantive
    // html way of using a <template> so the div itself can be considered
    // as replaced by it's content
    display: contents;
  }

  .timeline {
    display: grid;
    grid-template-columns: 1fr 2fr;
    @extend .lr-text--body-2;

    .time,
    .description {
      display: flex;
      position: relative;
      align-items: center;
      padding-inline: 1rem;
      height: clamp(9rem, 8vw, 20rem);

      &:has(~ .description:hover) {
        .overlay {
          transform: scaleY(1);
        }
      }

      &:hover {
        + .description {
          .overlay {
            transform: scaleY(1);
          }

          .description-title {
            opacity: 0;
          }
        }

        .overlay {
          transform: scaleY(1);
        }
        .description-title {
          opacity: 0;
        }

        + .description /* time:hover + .description .company img */,
        & /* description:hover .company img */ {
          .company img {
            filter: none;
          }
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

      h3.description-title {
        margin-bottom: 0.5rem;
        position: relative;
        transition: opacity 0.3s $default-ease;
      }

      .company {
        display: flex;
        align-items: center;
        gap: clamp(0.7rem, 3vw, 1.2rem);
        a {
          cursor: none;
          width: fit-content;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.7rem;
          border-radius: 50%;
          img {
            pointer-events: none; // for lr-cursor
            --size: clamp(1.8rem, 2vw, 3rem);
            opacity: 0.9;
            min-height: var(--size);
            min-width: var(--size);
            max-height: var(--size);
            max-width: var(--size);
            display: block;
            transition: filter 0.3s $default-ease;
            filter: contrast(300%) grayscale(1);
          }
        }
        h4 {
          @extend .lr-text--body-1;
          color: $main-dark-text-hsl-dark;
          position: relative;
          width: 100%;
        }
      }
    }
    .overlay {
      pointer-events: none; // for lr-cursor
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
          // inverted clamp !!
          margin-bottom: calc(3rem - clamp(0.5rem, 3.5vw, 3rem));
          @extend .lr-text--body-1-half;
        }
        h4 {
          visibility: hidden;
        }
      }
    }
  }

  .timeline-footer {
    @extend .lr-section-page-paddings;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 2rem;
    color: $main-dark-text-hsl-darker;
    text-align: right;
    a {
      padding: 1.1rem;

      svg {
        height: 20px;
        width: 20px;
      }
    }
  }
}
</style>
