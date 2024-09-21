<template>
  <nav class="c-LRHeaderNav">
    <ul>
      <li>
        <NuxtLink
          lr-cursor
          :to="localeRoute('/')"
          @click="$emit('routeSelected')"
        >
          <span>Home</span>
          <span>Home</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          lr-cursor
          :to="localeRoute('/music')"
          @click="$emit('routeSelected')"
        >
          <span>{{ $t('music') }}</span>
          <span>{{ $t('music') }}</span>
        </NuxtLink>
      </li>
      <ClientOnly>
        <li v-if="!session">
          <NuxtLink
            lr-cursor
            :to="localeRoute('/login')"
            @click="$emit('routeSelected')"
          >
            <span>{{ $t('login') }}</span>
            <span>{{ $t('login') }}</span>
          </NuxtLink>
        </li>
        <template v-else>
          <li>
            <NuxtLink
              lr-cursor
              :to="localeRoute('/profile')"
              @click="$emit('routeSelected')"
            >
              Profile
            </NuxtLink>
          </li>
          <li>
            <button
              lr-cursor
              @click="handleLogout"
            >
              <span>{{ $t('logout') }}</span>
              <span>{{ $t('logout') }}</span>
            </button>
          </li>
        </template>
      </ClientOnly>
    </ul>
    <div class="p-2 test">
      <LRLanguageToggle />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAppStore } from '~/store';

defineEmits(['routeSelected']);
const route = useRoute();
console.log('route.path', route.path);

const { logout } = useAppwrite();
const { lang, session } = toRefs(useAppStore());
const localeRoute = computed(() => (r: string) => lang.value === 'en' ? r : `${r}?locale=${lang.value}`);
const handleLogout = async () => {
  if (confirm('Are you sure you want to logout?')) {
    await logout();
  }
};
</script>

<style scoped lang="scss">
.c-LRHeaderNav {
  --gap: 0.25rem;
  display: flex;
  flex-direction: column;
  gap: var(--gap);

  ul {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
    align-items: flex-start;
    li {
      a,
      button {
        --padding: 0.5rem;
        text-transform: uppercase;
        font-weight: 700;
        padding: var(--padding);
        border-radius: 8px;
        cursor: none;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;

        &:hover:not(.router-link-active) {
          span {
            &:nth-child(1) {
              transform: translateY(0);
            }
            &:nth-child(2) {
              transform: translateY(-160%);
            }
          }
        }

        span {
          pointer-events: none; // allow lr-cursor to work smoothly
          line-height: 1;
          transition: transform 0.3s $default-ease;

          &:nth-child(1) {
            transform: translateY(160%);
          }
          &:nth-child(2):not(.selected) {
            position: absolute;
            right: 0;
            padding-right: var(--padding);
          }
        }

        &:not(.router-link-active) {
          span:nth-child(2) {
            color: $secoundary-dark-text;
          }
        }
      }
    }
  }
}

@media (min-width: $lg-breakpoint) {
  .c-LRHeaderNav {
    text-align: right;
    align-items: flex-end;
    ul {
      align-items: flex-end;
    }
  }
}
</style>
