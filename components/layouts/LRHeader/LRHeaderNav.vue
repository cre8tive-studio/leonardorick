<template>
  <nav class="c-LRHeaderNav">
    <ul class="mb-3 flex flex-col gap-4">
      <li>
        <NuxtLink
          lr-cursor
          :to="localeRoute('/')"
          @click="$emit('routeSelected')"
        >
          Home
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          lr-cursor
          :to="localeRoute('/music')"
          @click="$emit('routeSelected')"
        >
          {{ $t('music') }}
        </NuxtLink>
      </li>
      <ClientOnly>
        <li v-if="!session">
          <NuxtLink
            lr-cursor
            :to="localeRoute('/login')"
            @click="$emit('routeSelected')"
          >
            {{ $t('login') }}
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
              {{ $t('logout') }}
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
  display: flex;
  flex-direction: column;

  li {
    a,
    button {
      text-transform: uppercase;
      font-weight: 700;
      padding: 0.5rem;
      border-radius: 8px;
      cursor: none;
    }
  }
}

@media (min-width: $lg-breakpoint) {
  .c-LRHeaderNav {
    text-align: right;
    align-items: flex-end;
  }
}
</style>
