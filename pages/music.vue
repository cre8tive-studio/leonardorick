<template>
  <h1>Music page</h1>
</template>
<script lang="ts" setup>
const { data: subscription } = await useFetch('/api/getSubscription', {
  method: 'POST',
  body: {
    subscriptionId: 'sub_1O150SAP0o2qLZI5anHN9sJg',
  },
});
console.log(subscription.value);
</script>
<style lang="scss"></style>
