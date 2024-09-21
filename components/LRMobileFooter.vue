<template>
  <div class="c-MobileFooter">
    <div class="content">
      <div>
        <li
          v-for="(link, index) of links"
          :key="index"
          @click="openExternalLink(link.link)"
        >
          <component :is="link.svg" />
          {{ link.text }}
        </li>
      </div>
      <div class="second-column flex-1 flex flex-col">
        <h2>{{ $t('footer_message') }}</h2>
        <div class="email">
          <h4 class="relative">Email</h4>
          <a
            class="relative"
            href="mailto:leonardo@lanytecologia.com.br"
          >
            {{ email }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { links, email } = useLinks();
</script>

<style scoped lang="scss">
.c-MobileFooter {
  @extend .lr-section-page-paddings;
  .content {
    border-top: 1px solid $blue-3;
    padding-block: 1rem;
    display: flex;
    > * {
      flex: 1;
    }

    li {
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .second-column {
      font-size: 1.2rem;
      padding-bottom: 2rem;
      h2 {
        margin-bottom: 1rem;
      }
      h4 {
        font-size: 1rem;
      }

      a {
        font-size: 0.8rem;
        color: $main-dark-text-hsl-dark;
      }
    }
  }
}
</style>
