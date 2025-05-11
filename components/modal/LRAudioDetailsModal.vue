<!-- eslint-disable vue/no-v-html -->
<template>
  <LRModal
    :should-show-modal="shouldShowModal"
    max-width="90%"
    @close="$emit('close')"
  >
    <div
      data-lenis-prevent
      class="lr-audio-details-modal"
    >
      <div class="header-wrapper">
        <div class="image-wrapper">
          <NuxtImg
            height="500"
            width="500"
            src="/images/premium-disco.png"
            :alt="$t('alt.cover_image', { songName: audio?.title })"
            preload
          />
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
import { useAppStore } from '~/store';
import type { AudioModel } from '~/types/audio.model';
import type { PremiumAudioModel } from '~/types/premium-audio.model';
import type { LanguageOptions } from '~/utils/constants/languages';

interface Props {
  shouldShowModal: boolean;
  audio: AudioModel | PremiumAudioModel;
}

interface Emits {
  (e: 'close'): void;
  (e: 'download'): void;
}

const spotifyLanguageUrl: Record<LanguageOptions, string> = {
  en: 'us',
  'pt-BR': 'br-pt',
};

const { audio, shouldShowModal } = defineProps<Props>();
defineEmits<Emits>();

const { lang } = toRefs(useAppStore());
const sanitizedLyrics = computed(() => DOMPurify.sanitize(audio.lyrics || ''));
const spotifyLocalFilesLink = computed(
  () => `https://support.spotify.com/${spotifyLanguageUrl[lang.value]}/article/local-files/`
);
</script>

<style scoped lang="scss">
.lr-audio-details-modal {
  margin-bottom: 2rem;
}

.image-wrapper {
  border-radius: 50%;
  overflow: hidden;
  width: 60px;
  margin: 0 auto;
  margin-bottom: 1rem;
  box-shadow: $box-shadow-elevation-2;
  border: 2px solid $dark-text-4;
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
  margin-bottom: 32px;

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
  margin-bottom: 2rem;
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
      display: grid;
      grid-template-columns: var(--minor-column-width) 1fr;
      gap: 2rem;
    }

    .lyrics {
      height: 410px;
    }

    .content-box {
      margin-bottom: 0;
      box-shadow: $box-shadow-elevation-2;
      padding: 24px;
      border-radius: 12px;
    }
  }
}
</style>
