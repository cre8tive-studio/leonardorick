<template>
  <header>
    <nav>
      <ul class="pb-5">
        <li>
          <NuxtLink :to="localeRoute('/')"> Home </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localeRoute('/music')"> {{ $t('music') }} </NuxtLink>
        </li>
        <ClientOnly>
          <li v-if="!session">
            <NuxtLink :to="localeRoute('/login')">
              {{ $t('login') }}
            </NuxtLink>
          </li>
          <template v-else>
            <li>
              <NuxtLink :to="localeRoute('/profile')"> Profile </NuxtLink>
            </li>
            <li>
              <button @click="handleLogout">
                {{ $t('logout') }}
              </button>
            </li>
          </template>
        </ClientOnly>
      </ul>
    </nav>

    <form>
      <select v-model="lang">
        <option value="en">{{ $t('english') }}</option>
        <option value="pt-BR">{{ $t('portuguese') }}</option>
      </select>
    </form>

    <ClientOnly
      v-if="showThreeJs"
      fallback-tag="span"
      fallback="Loading Three.js model"
    >
      <ThreeLeonardoRick />
    </ClientOnly>
  </header>
  <div>
    <slot />
  </div>
</template>
<script setup lang="ts">
import { useAppStore } from '~/store';

const route = useRoute();
const { logout } = useAppwrite();
const { lang, session } = toRefs(useAppStore());

const showThreeJs = computed(
  () => (['/music'].includes(route.path) || route.path === '/') && false
);
const localeRoute = computed(
  () => (r: string) => lang.value === 'en' ? r : `${r}?locale=${lang.value}`
);

const handleLogout = async () => {
  if (confirm('Are you sure you want to logout?')) {
    await logout();
  }
};
</script>
<style scoped></style>
