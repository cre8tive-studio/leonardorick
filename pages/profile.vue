<template>
  <div>Profile page!</div>
  <p>edit your subscription</p>
  <button
    class="p-4 bg-neutral-400"
    @click="goToClientPortal"
  >
    go to stripe client portal to manage your subscriptions
  </button>
  <div v-if="user">
    <p>{{ user.email }}</p>
  </div>
  <p>your going to be redirected to an external link</p>
</template>

<script setup lang="ts">
import type { UserModel } from '~/types/user.model';

const { sripeClientPortalLink } = useRuntimeConfig().public;
const { getUser } = useAppwrite();
const user = ref<UserModel | null>();

onMounted(async () => {
  user.value = await getUser();
});

const goToClientPortal = () => {
  window.open(sripeClientPortalLink, '_blank');
};
</script>

<style scoped></style>
