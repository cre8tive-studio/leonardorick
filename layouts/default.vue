<template>
  <ClientOnly>
    <FluidBackground />
  </ClientOnly>
  <div class="l-default w-screen flex flex-col">
    <header class="l-default__header flex-shrink-0 flex gap-4">
      <nav>
        <ul class="pb-5 flex gap-4">
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
    </header>
    <div
      ref="defaultLayout"
      class="default-slot flex-grow overflow-y-auto"
    >
      <ClientOnly v-if="showThreeJs">
        <div class="l-default__background-positioner relative">
          <ThreeLeonardoRick :scroll-el="defaultLayout" />
        </div>
      </ClientOnly>
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAppStore } from '~/store';

const defaultLayout = ref<HTMLDivElement>();

const route = useRoute();
const { logout } = useAppwrite();
const { lang, session } = toRefs(useAppStore());

const showThreeJs = computed(() => ['/music'].includes(route.path) || route.path === '/');
const localeRoute = computed(() => (r: string) => lang.value === 'en' ? r : `${r}?locale=${lang.value}`);

const handleLogout = async () => {
  if (confirm('Are you sure you want to logout?')) {
    await logout();
  }
};
</script>
<style scoped lang="scss">
.l-default {
  &__header {
    height: $header-opened-height;
  }

  .default-slot {
    height: calc(100vh - $header-opened-height);
    /* HIDE SCROLLBAR */
    /* Internet Explorer 10+ */
    -ms-overflow-style: none;
    /* Firefox */
    scrollbar-width: none;
  }

  /* HIDE SCROLLBAR */
  .default-slot::-webkit-scrollbar {
    /* Safari and Chrome */
    display: none;
  }
}
</style>
