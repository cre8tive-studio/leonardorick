<template>
  <header>
    <nav>
      <ul class="pb-5">
        <li>
          <NuxtLink :to="localeRoute('/')"> Home </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localeRoute('/music')"> Music </NuxtLink>
        </li>
        <ClientOnly>
          <li v-if="!sessionId">
            <NuxtLink :to="localeRoute('/login')">
              {{ $t('login') }}
            </NuxtLink>
          </li>
          <template v-else>
            <li>
              <button @click="handleLogout">
                {{ $t('logout') }}
              </button>
            </li>
            <li>
              <NuxtLink :to="localeRoute('/profile')"> Profile </NuxtLink>
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

// remember to implement this validation in all
// layouts of the application
const { $initializerClientError } = useNuxtApp();
if ($initializerClientError) {
  // todo setup modal error
  // eslint-disable-next-line no-console
  console.error($initializerClientError);
}

const store = useAppStore();
const route = useRoute();
const { logout } = useAppwrite();

const handleLogout = async () => {
  if (confirm('Are you sure you want to logout?')) {
    await logout();
  }
};
const { lang, sessionId } = toRefs(store);
const showThreeJs = computed(
  () => (['/music'].includes(route.path) || route.path === '/') && false
);
const localeRoute = computed(
  () => (r: string) => lang.value === 'en' ? r : `${r}?locale=${lang.value}`
);
</script>
<style scoped></style>
