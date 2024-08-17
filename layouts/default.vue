<template>
  <div class="l-default w-screen flex flex-row-reverse p-4">
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
    <footer class="l-default__footer flex items-end">
      <nav>
        <ul class="flex flex-col gap-5">
          <li>
            <NuxtLink
              to="https://spotify.com"
              target="_blank"
            >
              <SvgoSpotify />
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="https://github.com"
              target="_blank"
            >
              <SvgoGithub />
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="https://linkedin.com"
              target="_blank"
            >
              <SvgoLinkedin />
            </NuxtLink>
          </li>
          <li>
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
  &__header {
    height: $header-opened-height;
    width: 88px;
  }

  &__footer {
    min-width: 88px;
    li {
      &:hover {
        color: $main-dark-bg;
        transition: color 0.3s ease-in-out;
      }
      svg {
        height: 38px;
        width: 38px;
      }
    }
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
</style>
