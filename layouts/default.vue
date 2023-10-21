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
          <li>
            <NuxtLink
              v-if="!sessionId"
              :to="localeRoute('/login')"
            >
              {{ $t('login') }}
            </NuxtLink>
            <button
              v-else
              @click="logout"
            >
              {{ $t('logout') }}
            </button>
          </li>
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

const store = useAppStore();
const route = useRoute();
const { auth } = useAppwrite();

const { lang, sessionId } = toRefs(store);
const { $sessionId, $initializerClientError } = useNuxtApp();

const showThreeJs = computed(
  () => (['/music'].includes(route.path) || route.path === '/') && false
);
const localeRoute = computed(
  () => (r: string) => lang.value === 'en' ? r : `${r}?locale=${lang.value}`
);

useLang();

if ($initializerClientError) {
  // todo setup modal error
  //   console.error($initializerClientError);
}
sessionId.value = $sessionId;

const logout = async () => {
  const session = await auth.getSession('current');
  await auth.deleteSession(session.$id);
  sessionId.value = '';
};
</script>
<style scoped></style>
