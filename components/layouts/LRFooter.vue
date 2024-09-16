<template>
  <footer
    activated="false"
    class="c-LRFooter lr-section-bottom w-full fixed bottom-0 hidden lg:flex flex-col items-center"
  >
    <div class="separator" />
    <div class="flex w-full">
      <div class="flex-1 flex flex-row">
        <div class="left-spacer"></div>
        <ul class="flex-1 flex flex-col">
          <li
            v-for="(link, index) of links"
            :key="index"
            ref="lis"
            class="main-hover-button"
            lr-magnetic-hover
            @click="openExternalLink(link.link)"
          >
            <div class="overlay">{{ link.funTitle }}</div>
            <NuxtLink
              :to="link.link"
              target="_blank"
            >
              <component :is="link.svg" />
            </NuxtLink>
            <span>{{ link.text }}</span>
          </li>
        </ul>
      </div>
      <div class="second-column flex-1 flex flex-col">
        <h2>{{ $t('footer_message') }}</h2>
        <div class="email">
          <h4 class="relative">Email</h4>
          <div class="email__overlay">
            <h4>{{ $t('footer_message_email') }}</h4>
            <a>[hidden]</a>
          </div>

          <a
            class="relative"
            href="mailto:leonardo@lanytecologia.com.br"
          >
            {{ email }}
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const lis = ref<HTMLLIElement[]>();
const { links, email } = useLinks();
</script>
<style scoped lang="scss">
.c-LRFooter {
  min-width: $sides-xl-width;
  font-size: 2rem;
  margin-top: 2rem;

  .left-spacer {
    height: 100%;
    pointer-events: none;
  }

  li {
    padding-inline: 1rem;
    --size: 72px;
    height: var(--size);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 1rem;
    font-size: 2rem;
    position: relative;
    pointer-events: auto;
    a {
      position: relative;
      height: 100%;
      width: fit-content;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        height: 32px;
        width: 32px;
        pointer-events: none;
      }
    }

    span {
      transition: opacity 0.3s $default-ease;
    }

    .overlay {
      transform: scaleY(0);
      height: 100%;
      width: 100%;
      position: absolute;
      font-size: 1.4rem;
      top: 0;
      left: 0;

      padding-left: calc(2rem + 32px);
      display: flex;
      align-items: center;
      background-color: rgba($highlight-2, 0.9);
      transition: transform 0.3s $default-ease;
      opacity: 0;
    }

    &:hover {
      cursor: pointer;
      .overlay {
        transform: scaleY(1);
        color: $main-dark-text;
      }
      span {
        opacity: 0;
        cursor: pointer;
      }
    }

    &[lr-magnetic-hover='false'] {
      color: $main-dark-text;

      .overlay {
        opacity: 1;
      }

      span {
        width: auto;
      }
    }
  }

  .second-column {
    transition: opacity 0.3s $default-ease;

    h2 {
      margin: 1rem;
      margin-block: 0.7rem;
    }
    .email {
      font-size: 1.2rem;
      position: relative;

      h4 {
        transition: opacity 0.3s $default-ease;
      }

      a {
        color: $main-dark-text-dark;
      }

      &:hover {
        & > h4 {
          opacity: 0;
        }
        .email__overlay {
          transform: scaleY(1);
        }
      }

      &__overlay {
        position: absolute;

        inset: 0;
        background-color: rgba($highlight-2, 0.9);
        transition: transform 0.3s $default-ease;
        transform: scaleY(0);

        a {
          visibility: hidden;
        }
      }
    }

    .email,
    .email__overlay {
      padding-inline: 1rem;
      padding-block: 0.5rem;
    }
  }

  .separator {
    width: 80%;
    height: 1px;
    margin-bottom: 2rem;
    background-color: $blue-3;
    transition: opacity 0.3s $default-ease;
    opacity: 1;
  }

  /**
  * footer is activated when we reach the end of the page
  * and it appears bibgger and expnanded. activated='fase'
  * is the default footer state when we first load the page
  */
  &[activated='false'] {
    pointer-events: none;
    .separator {
      opacity: 0;
    }

    .second-column {
      opacity: 0;
      pointer-events: none;
    }

    .overlay {
      pointer-events: none;
    }

    li {
      width: 70px;
      a {
        cursor: none;
      }
      span {
        opacity: 0;
        pointer-events: none;
      }
    }

    .left-spacer {
      width: 0;
    }
  }
}
</style>
