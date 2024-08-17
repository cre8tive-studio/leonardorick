<template>
  <footer class="c-LRFooter flex items-end">
    <nav>
      <ul class="flex flex-col gap-5">
        <li class="main-hover-button">
          <NuxtLink
            to="https://spotify.com"
            target="_blank"
          >
            <SvgoSpotify />
          </NuxtLink>
        </li>
        <li class="main-hover-button">
          <NuxtLink
            to="https://github.com"
            target="_blank"
          >
            <SvgoGithub />
          </NuxtLink>
        </li>
        <li class="main-hover-button">
          <NuxtLink
            to="https://linkedin.com"
            target="_blank"
          >
            <SvgoLinkedin />
          </NuxtLink>
        </li>
        <li class="main-hover-button">
          <NuxtLink
            to="https://stackoverflow.com"
            target="_blank"
          >
            <SvgoStackoverflow />
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </footer>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.c-LRFooter {
  min-width: 88px;
  li {
    svg {
      height: 38px;
      width: 38px;
    }
  }
}
</style>
