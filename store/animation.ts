import { isDefined } from '@leonardorick/utils';
import type { Fluid } from '~/components/FluidBackground/fluid';

interface AnimationStoreModel {
  isEnteringAnimationFinished: boolean;
  isLRModelLoaded: boolean;
  isLRModelTimedout: boolean;
  isOverlayCompleteHidden: boolean;
  loadingProgress: number;
  loadingTotal: number;
  fluid: Fluid | null;
  fluidCanvas: HTMLCanvasElement | undefined;
  logoCanvas: HTMLCanvasElement | undefined;
  loadingBarRef: HTMLDivElement | undefined;
  overlayRef: HTMLDivElement | undefined;
  cubeLoaderContainerRef: HTMLDivElement | undefined;
  cursorOuter: HTMLDivElement | undefined;
  cursorInner: HTMLDivElement | undefined;
  isCursorActivated: boolean;
  isMagneticHoverActivated: boolean;
  isHideOnScrollBlocked: boolean;
}

interface PrivateAnimationStoreModel {
  isScrollEnabled: boolean;
  blockTogglingScroll: boolean;
}

export const useAnimationStore = defineStore('animationStore', () => {
  const state = reactive<AnimationStoreModel>({
    isEnteringAnimationFinished: false,
    isLRModelLoaded: false,
    isLRModelTimedout: false,
    isOverlayCompleteHidden: false,
    loadingProgress: 0,
    loadingTotal: 0,
    fluid: null,
    fluidCanvas: undefined,
    logoCanvas: undefined,
    loadingBarRef: undefined,
    overlayRef: undefined,
    cubeLoaderContainerRef: undefined,
    cursorOuter: undefined,
    cursorInner: undefined,
    isCursorActivated: false,
    isMagneticHoverActivated: false,
    isHideOnScrollBlocked: false,
  });

  const privateState = reactive<PrivateAnimationStoreModel>({
    blockTogglingScroll: false,
    isScrollEnabled: true,
  });

  function updateBlockTogglingScroll(value?: boolean) {
    if (isDefined(value)) {
      privateState.blockTogglingScroll = value;
    }
  }
  function enableScroll({ blockTogglingScroll }: { blockTogglingScroll?: boolean } = {}) {
    updateBlockTogglingScroll(blockTogglingScroll);

    if (!privateState.blockTogglingScroll) {
      privateState.isScrollEnabled = true;
    }
  }

  function disableScroll({ blockTogglingScroll }: { blockTogglingScroll?: boolean } = {}) {
    if (!privateState.blockTogglingScroll) {
      privateState.isScrollEnabled = false;
    }

    updateBlockTogglingScroll(blockTogglingScroll);
  }

  const isScrollEnabled = computed(() => privateState.isScrollEnabled);

  return {
    ...toRefs(state),
    isScrollEnabled,

    // functions,
    enableScroll,
    disableScroll,
  };
});
