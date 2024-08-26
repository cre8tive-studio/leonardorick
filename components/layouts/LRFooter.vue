<template>
  <footer class="c-LRFooter lr-section-bottom lr-safe-pointer-events-none w-full fixed bottom-0 hidden lg:flex">
    <nav>
      <ul class="flex w-fit flex-col">
        <li
          v-for="(link, index) of links"
          :key="index"
          ref="lis"
          class="main-hover-button"
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
    link: 'https://linkedin.com/in/leonardo-rick/',
    svg: SvgoLinkedin,
  },
  {
    link: 'https://github.com/LeonardoRick',
    svg: SvgoGithub,
  },
  {
    link: 'https://stackoverflow.com/users/10526869/leonardo-rick',
    svg: SvgoStackoverflow,
  },
  {
    link: 'https://open.spotify.com/intl-pt/artist/166zddGlNMJbuq99HrkyNb',
    svg: SvgoSpotify,
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
        height: 32px;
        width: 32px;
        pointer-events: none;
      }

      &:hover {
        color: $highlight-3;
      }
    }
  }
}
</style>
