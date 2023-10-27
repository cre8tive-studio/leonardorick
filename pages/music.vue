<template>
  <h1>Music page</h1>

  <ClientOnly>
    <div
      v-for="song in songs"
      :key="song.number"
      class="border border-gray-300 p-4 m-4"
    >
      <h2>{{ song.title }}</h2>
      <audio
        v-if="song.songUrl"
        :src="song.songUrl"
        controls
      ></audio>
      <div v-else-if="filesLoading">Loading song player...</div>
      <div v-else>Unable to load song player for this song. Try again latter</div>
    </div>
  </ClientOnly>
</template>
<script lang="ts" setup>
import type { DemoClientModel } from '../types/demo-client.model';

const { getCurrentSession, getJWT } = useAppwrite();
const { request } = useRequest();
const songs = ref<DemoClientModel[]>([]);
const songsLoadedCount = ref(0);

const filesLoading = computed(() => songsLoadedCount.value < songs.value.length);

setLoggedInformation();

async function setLoggedInformation() {
  const session = await getCurrentSession();
  if (session) {
    request<DemoClientModel[]>('/api/getSongsMetadata').then(({ data }) => {
      songs.value = data.value;
      songs.value.forEach(async (model) => {
        const { error } = await useFetch('/api/getSongFile', {
          method: 'post',
          body: {
            number: model.number,
          },
          headers: {
            Authorization: await getJWT(),
          },
          responseType: 'blob',
          onResponse({ response }) {
            const url = URL.createObjectURL(response._data);
            model.songUrl = url;
            songsLoadedCount.value += 1;
          },
          onResponseError() {
            model.songUrl = null;
          },
        });

        // sometime the request is cached and just return the error. In this case
        // we don't pass through the interceptors and need to handle the error here
        if (error.value) {
          model.songUrl = null;
          songsLoadedCount.value += 1;
        }
      });
    });
  }
}
</script>
<style lang="scss"></style>
