<template>
  <nav>
    <ul class="pb-5 flex flex-col gap-4">
      <li>
        <NuxtLink
          :to="localeRoute('/')"
          @click="$emit('routeSelected')"
        >
          Home
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          :to="localeRoute('/music')"
          @click="$emit('routeSelected')"
        >
          {{ $t('music') }}
        </NuxtLink>
      </li>
      <ClientOnly>
        <li v-if="!session">
          <NuxtLink
            :to="localeRoute('/login')"
            @click="$emit('routeSelected')"
          >
            {{ $t('login') }}
          </NuxtLink>
        </li>
        <template v-else>
          <li>
            <NuxtLink
              :to="localeRoute('/profile')"
              @click="$emit('routeSelected')"
            >
              Profile
            </NuxtLink>
          </li>
          <li>
            <button @click="handleLogout">
              {{ $t('logout') }}
            </button>
          </li>
        </template>
      </ClientOnly>
    </ul>
    <form class="language-select-form">
      <select v-model="lang">
        <option value="en">{{ $t('english') }}</option>
        <option value="pt-BR">{{ $t('portuguese') }}</option>
      </select>
    </form>
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
.language-select-form {
  color: $main-dark-bg;
  select {
    width: 80px;
    cursor: pointer;
  }
}
</style>
