<!-- eslint-disable vue/no-v-html -->
<template>
  <LRModal
    :should-show-modal="shouldShowModal"
    height="85vh"
    max-width="90%"
    @close="close"
  >
    <div
      data-lenis-prevent
      class="lr-audio-details-modal"
    >
      <div class="header-wrapper">
        <div class="w-full flex gap-2 justify-center items-center">
          <button
            v-if="!isMobile"
            lr-cursor
            class="simple-action-button"
            :disabled="volume === 0"
            @click="decreaseVolume"
          >
            <fa icon="volume-low" />
          </button>
          <div class="image-wrapper">
            <NuxtImg
              height="500"
              width="500"
              src="/images/premium-disco.png"
              :alt="$t('alt.cover_image', { songName: audio?.title })"
              preload
            />
            <LRPlayButton
              :wave="wave"
              size="sm"
              @play="localPlayPause"
            />
          </div>
          <button
            v-if="!isMobile"
            lr-cursor
            class="simple-action-button"
            :disabled="volume === 1"
            @click="increaseVolume"
          >
            <fa icon="volume-high" />
          </button>
        </div>
        <h1 class="lr-text--body-1 font-bold">{{ audio.title }} &nbsp; 🎼</h1>
      </div>

      <div class="content-wrapper">
        <template v-if="audio.lyrics">
          <h2 class="lr-text--body-0-half hidden lg-inline mt-1">{{ $t('lyrics') }}</h2>
          <div
            class="content-box lyrics"
            v-html="sanitizedLyrics"
          />
        </template>
        <template v-if="audio.description">
          <h2 class="lr-text--body-0-half">{{ $t('description') }}</h2>
          <div class="content-box">{{ audio.description }}</div>
        </template>

        <h2 class="lr-text--body-0-half">{{ $t('how_to_add_spotify_title') }}</h2>
        <div class="content-box spotify-description">
          <i18n-t
            tag="p"
            keypath="how_to_add_spotify_description"
            scope="global"
          >
            <template #icon>
              <button
                class="simple-action-button colorful-actions"
                lr-cursor
                :aria-label="$t('download')"
                @click="$emit('download')"
              >
                <fa icon="download" />
              </button>
            </template>
            <template #spotifyDescriptionLink>
              <a
                lr-cursor
                class="lr-anchor"
                target="_blank"
                :href="spotifyLocalFilesLink"
              >
                {{ $t('how_to_add_spotify_description_link_text') }}
              </a>
            </template>
          </i18n-t>
        </div>
      </div>
    </div>
  </LRModal>
</template>

<script setup lang="ts">
import DOMPurify from 'dompurify';
import type WaveSurfer from 'wavesurfer.js';
import { useAppStore } from '~/store';
import { useAudioStore } from '~/store/audio';
import type { AudioModel } from '~/types/audio.model';
import type { PlayOptions } from '~/types/play.options';
import type { PremiumAudioModel } from '~/types/premium-audio.model';
import type { LanguageOptions } from '~/utils/constants/languages';

interface Props {
  shouldShowModal: boolean;
  audio: AudioModel | PremiumAudioModel;
  wave?: WaveSurfer;
}

interface Emits {
  (e: 'close'): void;
  (e: 'play', value: PlayOptions): void;
  (e: 'download'): void;
}

const spotifyLanguageUrl: Record<LanguageOptions, string> = {
  en: 'us',
  'pt-BR': 'br-pt',
};

const { isMobile } = useDevice();
const { audio, shouldShowModal, wave } = defineProps<Props>();
const $emit = defineEmits<Emits>();
const mounted = ref(false);

const { lang } = toRefs(useAppStore());
const { increaseVolume, decreaseVolume, volume } = toRefs(useAudioStore());

const { playPause, setExternalWavesurfer } = useWavesurfer(true);

const sanitizedLyrics = computed(() => DOMPurify.sanitize(audio.lyrics || ''));
const spotifyLocalFilesLink = computed(
  () => `https://support.spotify.com/${spotifyLanguageUrl[lang.value]}/article/local-files/`
);

onMounted(() => {
  watch(
    () => shouldShowModal,
    async (isOpen) => {
      if (!import.meta.client) return;
      await nextTick();

      // acts like onMounted
      if (isOpen) {
        if (!wave) return;
        setExternalWavesurfer(wave);

        mounted.value = true;
        // acts like onUnmounted
      } else if (mounted.value) {
        //
      }
    },
    { immediate: true }
  );
});

function close() {
  $emit('close');
}

async function localPlayPause($event: PlayOptions) {
  $emit('play', $event);
  playPause();
}
</script>

<style scoped lang="scss">
.lr-audio-details-modal {
  margin-bottom: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header-wrapper {
  button {
    height: 48px;
    width: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    position: relative;
    bottom: 4px;
    color: $dark-text-3;

    &:hover:not(.disabled):not(:disabled) {
      color: $highlight;
    }
  }
}
.image-wrapper {
  border-radius: 50%;
  overflow: hidden;
  width: 60px;
  margin-bottom: 1rem;
  box-shadow: $box-shadow-elevation-2;
  border: 2px solid $dark-text-4;
  position: relative;

  button {
    position: absolute;
    left: 60%;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.3s $default-ease;
    scale: 1.15 !important;
  }

  img {
    transition: opacity 0.3s $default-ease;
  }

  &:hover {
    img {
      opacity: 0;
    }
    button {
      opacity: 1;
    }
  }
}

h1 {
  text-align: center;
  text-transform: uppercase;
  color: $highlight;
  margin-bottom: 18px;
}

h2 {
  text-transform: uppercase;
  color: $highlight;
  text-align: center;
  margin-bottom: 12px;
  margin-top: 6px;
}

.lyrics {
  border: 1px solid $dark-text-5;
  border-radius: 12px;

  height: 350px;
  overflow-y: auto;
  overscroll-behavior: contain;
  letter-spacing: 0.06em;
  line-height: 1.6rem;

  > * {
    margin-bottom: 24px;
  }
}

.spotify-description {
  display: flex;
  align-items: center;

  p {
    max-width: 600px;
  }

  button {
    height: 26px;
    width: 26px;
  }
}

.content-box {
  padding-bottom: 3rem;
  margin-bottom: 3rem;
}

@media (min-width: $lg-breakpoint) {
  .lr-audio-details-modal {
    --minor-column-width: 150px;
    margin: 0 auto;
    margin-bottom: 2rem;

    .header-wrapper {
      margin-left: var(--minor-column-width);
    }

    h1 {
      margin-bottom: 2rem;
    }
    h2 {
      display: block;
      margin-bottom: 12px;
      text-align: right;
      margin-bottom: 0;
    }

    .content-wrapper {
      flex: 1;
      display: grid;
      grid-template-columns: var(--minor-column-width) 1fr;
      gap: 2rem;
    }

    .lyrics {
      height: 550px;
    }

    .content-box {
      margin-bottom: 0;
      box-shadow: $box-shadow-elevation-2;
      padding: 2rem;
      padding-bottom: 3rem;
      border-radius: 12px;
    }
  }
}
</style>
