<template>
  <h1>Music page</h1>
</template>
<script lang="ts" setup>
const { getCurrentSession } = useAppwrite();
const session = await getCurrentSession();
if (session) {
  const { request } = useRequest();
  const { data: songs } = await request('/api/getSongs');
  console.log('songs.value', songs.value);
}
</script>
<style lang="scss"></style>
