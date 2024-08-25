<template>
  <footer class="c-LRFooter lr-section-bottom lr-safe-pointer-events-none w-full fixed bottom-0 hidden xl:flex">
    <nav>
      <ul class="flex w-fit flex-col">
        <li
          v-for="(link, index) of links"
          :key="index"
          ref="lis"
          calss="main-hover-button"
          magnetic-hover
        >
          <NuxtLink
            :to="link.link"
            target="_blank"
          >
            <component :is="link.svg" />
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </footer>
</template>

<script setup lang="ts">
import SvgoSpotify from '~/assets/icons/spotify.svg';
import SvgoGithub from '~/assets/icons/github.svg';
import SvgoLinkedin from '~/assets/icons/linkedin.svg';
import SvgoStackoverflow from '~/assets/icons/stackoverflow.svg';

const lis = ref<HTMLLIElement[]>();
const links = [
  {
    link: 'https://spotify.com',
    svg: SvgoSpotify,
  },
  {
    link: 'https://github.com',
    svg: SvgoGithub,
  },
  {
    link: 'https://linkedin.com',
    svg: SvgoLinkedin,
  },
  {
    link: 'https://stackoverflow.com',
    svg: SvgoStackoverflow,
  },
];
</script>

<style scoped lang="scss">
.c-LRFooter {
  min-width: $sides-xl-width;

  li {
    --size: 72px;
    width: var(--size);
    height: var(--size);
    display: flex;
    align-items: center;
    justify-content: center;
    a {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 300ms ease;
      cursor: none;

      svg {
        height: 24px;
        width: 24px;
        pointer-events: none;
      }
    }
  }
}
</style>
