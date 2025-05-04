<template>
  <nav class="c-LRHeaderNav">
    <ul>
      <li>
        <NuxtLink
          lr-cursor
          :to="localeRoute('index')"
          @click="$emit('toggleMobileMenu')"
        >
          <span>Home</span>
          <span>Home</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          lr-cursor
          :to="localeRoute('music')"
          @click="$emit('toggleMobileMenu')"
        >
          <span>{{ $t('music') }}</span>
          <span>{{ $t('music') }}</span>
        </NuxtLink>
      </li>
      <ClientOnly>
        <li v-if="!session">
          <button
            lr-cursor
            @click="handleLogin"
          >
            <span>{{ $t('login') }}</span>
            <span>{{ $t('login') }}</span>
          </button>
        </li>
        <template v-else>
          <li>
            <NuxtLink
              lr-cursor
              :to="localeRoute('profile')"
              @click="$emit('toggleMobileMenu')"
            >
              <span>{{ $t('profile') }}</span>
              <span>{{ $t('profile') }}</span>
            </NuxtLink>
          </li>
          <li>
            <button
              lr-cursor
              @click="shouldShowModal = true"
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
    <LRModal
      :should-show-modal="shouldShowModal"
      max-width="500px"
      height="fit-content"
      @close="shouldShowModal = false"
    >
      <div class="flex flex-col items-center justify-center h-full gap-8">
        <h2 class="lr-text--body-1-half text-center whitespace-nowrap">{{ $t('are_you_sure_logout') }}</h2>
        <div class="flex gap-4">
          <button
            lr-cursor
            class="lr-button"
            @click="shouldShowModal = false"
          >
            {{ $t('back') }}
          </button>
          <button
            lr-cursor
            class="lr-button lr-button-secondary"
            @click="handleLogout"
          >
            {{ $t('logout') }}
          </button>
        </div>
      </div>
    </LRModal>
  </nav>
</template>

<script setup lang="ts">
import { useAppStore } from '~/store';
import { useToasterStore } from '~/store/toaster';

const $emit = defineEmits(['toggleMobileMenu']);

const store = useAppStore();
const router = useRouter();
const { t: $t } = useI18n();

const { logout, getCurrentSession } = useAppwrite();
const toast = useToasterStore();
const { session } = toRefs(store);
const { localeRoute } = store;

const shouldShowModal = ref(false);

const handleLogin = async () => {
  if (await getCurrentSession(true)) {
    router.push(localeRoute('music'));
    toast.success({ text: $t('you_are_already_logged_in') });
  } else {
    router.push(localeRoute('login'));
  }
  $emit('toggleMobileMenu');
};
const handleLogout = async () => {
  await logout();
  router.replace(localeRoute('index'));
  shouldShowModal.value = false;
  toast.success({ text: $t('logged_out_successfully') });
  $emit('toggleMobileMenu');
};
</script>

<style scoped lang="scss">
.c-LRHeaderNav {
  --gap: clamp(0.25rem, 0.8vw, 0.5rem);
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
        --padding: 0.5rem; // used in .cursor-rolling-menu-item
        --translate: 160%; // used in .cursor-rolling-menu-item
        @extend .cursor-rolling-menu-item;

        text-transform: uppercase;
        font-weight: 700;
        padding: var(--padding);
        border-radius: 8px;
        cursor: none;
        display: flex;
        flex-direction: column;
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
