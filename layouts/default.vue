<template>
  <div class="l-default w-screen">
    <NuxtLink
      class="home-logo main-hover-button"
      :to="localeRoute('/')"
    >
      <SvgoLeonardorick />
    </NuxtLink>
    <div class="w-full flex flex-row-reverse">
      <header class="l-default__header flex-shrink-0 flex flex-col gap-4">
        <nav>
          <ul class="pb-5 flex flex-col gap-4 text-right">
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

        <form class="language-select-form flex justify-end">
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
            <ThreeLeonardoRick />
          </div>
        </ClientOnly>
        <slot />
      </div>
      <LRFooter />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAppStore } from '~/store';
import { useAnimationStore } from '~/store/animation';

const defaultLayout = ref<HTMLDivElement>();

const route = useRoute();
const { logout } = useAppwrite();
const { lang, session } = toRefs(useAppStore());
const { scrollLayout } = toRefs(useAnimationStore());

onMounted(() => {
  scrollLayout.value = defaultLayout.value;
});

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
  padding: 16px;
  position: relative;
  .home-logo {
    position: absolute;
    padding: 16px;
    svg {
      height: 48px;
      width: 48px;
    }
  }
  &__header {
    height: $header-opened-height;
    width: 88px;
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

  .language-select-form {
    color: $main-dark-bg;
    select {
      width: 80px;
    }
  }
}

@media (min-width: 1280px) {
  .l-default {
    padding-top: 24px;
    padding-bottom: 24px;
    padding-right: 48px;
    padding-left: 48px;
  }
}
</style>
