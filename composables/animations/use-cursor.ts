import { gsap } from 'gsap';
import { COLORS } from '~/utils/constants/colors';
import { useAnimationStore } from '~/store/animation';
import { useAppStore } from '~/store';

const cursor = {
  x: -100,
  y: -100,
};
const cursorOuterOriginalState = {
  width: 48,
  height: 48,
  top: '-2.5px',
  left: '-2.5px',
};

const MOUSE_TEXT_TIMEOUT = 10000;
const SCROLL_DOWN_TEXT_KEY = 'scroll_down';
const CURSOR_WORD_CLASS = 'cursor-word';
const TO_FOCUS_TAGS_DISABLED = new Set(['BUTTON', 'INPUT']);
let scrollDownTimeout: NodeJS.Timeout | null;
let scrollDownAgainTimeout: NodeJS.Timeout | null;
let addTextTimeout: NodeJS.Timeout | null;
let removeTextTimeout: NodeJS.Timeout | null;

let lastScrolledY = 0;
let lastScrolledX = 0;
let buttons = 0;
let lastTargetBox: DOMRect;
let lastTargetEl: HTMLElement;
let lastMouseTextEl: HTMLElement | null;
let removedTextAndDidNotAddAgain = false;
// each different text we want to add should have a
// block flag to we don't overwide the text with
// another while it's still working it's logic
let mouseTextScrollCallToActionStarted = false;
let mouseTextScrollCallToActionFinished = false;

const elementsToFocus = new Set<HTMLElement>();

const useCursor = () => {
  const { t: $t } = useI18n();
  const { cursorOuter, cursorInner, isCursorActivated: activated } = toRefs(useAnimationStore());
  const { lang } = toRefs(useAppStore());
  const route = useRoute();
  const text = ref('');
  const isStuck = ref(false);
  let scrollDownText = $t(SCROLL_DOWN_TEXT_KEY);

  let unwatchTranslateMouseText: ReturnType<typeof watch>;

  const isHomePage = computed(() => route.path === '/');

  watch(
    () => route.path,
    () => {
      // we only show the text on the mouse if the user opens the app in the home page. Also,
      // if he changes the page from home, we remove the listener and the logic to add it.
      if (!isHomePage.value) {
        mouseTextScrollCallToActionFinished = true;
        scrollDownTimeout = clearAndDeleteTimeout(scrollDownTimeout);
      }

      if (!activated.value || !cursorOuter.value || !lastTargetBox) return;

      // fix navigating making lr-cursor to lose focus
      gsap.to(cursorOuter.value, {
        duration: 0,
        x: lastTargetBox.x,
        y: lastTargetBox.y,
      });
    }
  );

  function activate() {
    if (!cursorOuter.value) return;
    setCursorOuterOriginalState();

    if (isHomePage.value) {
      watchMouseTextToTranslate();
      addScrollCallToAction();
    }

    activated.value = true;
  }

  function watchMouseTextToTranslate() {
    if (unwatchTranslateMouseText) unwatchTranslateMouseText();

    unwatchTranslateMouseText = watch(lang, () => {
      if (!mouseTextScrollCallToActionFinished) {
        scrollDownText = $t(SCROLL_DOWN_TEXT_KEY);
        if (mouseTextScrollCallToActionStarted) {
          text.value = scrollDownText;
        } else {
          addScrollCallToAction();
        }
      } else {
        unwatchTranslateMouseText();
      }
    });

    watch(isStuck, () => {
      if (!cursorOuter.value || !lastMouseTextEl || mouseTextScrollCallToActionFinished) return;

      if (isStuck.value) {
        lastMouseTextEl.style.opacity = '0';
        addCursorOuterBorder();
      } else {
        lastMouseTextEl.style.opacity = '1';
        cursorOuter.value.style.border = 'none';
      }
    });

    watch(text, () => {
      if (!cursorOuter.value) return;
      if (text.value) {
        const t = text.value + ' ';
        const mouseTextEl = document.createElement('div');
        mouseTextEl.classList.add(CURSOR_WORD_CLASS);
        const numChars = t.length; // number of characters
        const radius = 28; // radius of the circle
        const offsetAngle = Math.PI; // 45 degrees in radians

        for (const [index, char] of [...t].entries()) {
          const charEl = document.createElement('span');
          const angle = (index / numChars) * 2 * Math.PI + offsetAngle; // angle in radians

          charEl.innerHTML = char === ' ' ? '&nbsp;' : char;

          // Calculate position based on angle
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          // Set custom properties for styling
          charEl.style.setProperty('--x', `${x}px`);
          charEl.style.setProperty('--y', `${y}px`);
          charEl.style.setProperty('--rotate', `${(angle * 180) / Math.PI + 90}deg`);
          mouseTextEl.appendChild(charEl);
        }
        addMouseText(mouseTextEl);
      } else {
        removeMouseText(true);
      }
    });
  }

  function addMouseText(mouseTextEl: HTMLElement) {
    if (!cursorOuter.value) return;

    mouseTextEl.style.opacity = '0';
    if (lastMouseTextEl) {
      lastMouseTextEl.style.opacity = '0';
    }
    cursorOuter.value.appendChild(mouseTextEl);

    if (addTextTimeout) clearTimeout(addTextTimeout);
    addTextTimeout = setTimeout(() => {
      if (!cursorOuter.value) return;

      if (!removedTextAndDidNotAddAgain && lastMouseTextEl && cursorOuter.value.contains(lastMouseTextEl)) {
        cursorOuter.value.removeChild(lastMouseTextEl);
      }

      if (!isStuck.value) {
        mouseTextEl.style.opacity = '1';
        cursorOuter.value.style.border = 'none';
      }
      lastMouseTextEl = mouseTextEl;
      removedTextAndDidNotAddAgain = false;
    }, 300);
  }

  function removeMouseText(del = false) {
    if (!lastMouseTextEl || removedTextAndDidNotAddAgain) return;
    lastMouseTextEl.style.opacity = '0';

    removedTextAndDidNotAddAgain = true;
    if (removeTextTimeout) clearTimeout(removeTextTimeout);
    removeTextTimeout = setTimeout(() => {
      if (!cursorOuter.value) return;

      if (lastMouseTextEl && cursorOuter.value.contains(lastMouseTextEl)) {
        cursorOuter.value.removeChild(lastMouseTextEl);
      }

      addCursorOuterBorder();

      if (del) {
        lastMouseTextEl = null;
      }
    }, 300);
  }

  function addScrollCallToAction() {
    if (!isHomePage.value) {
      mouseTextScrollCallToActionFinished = true;
      scrollDownTimeout = clearAndDeleteTimeout(scrollDownTimeout);
      return;
    }

    if (scrollDownTimeout) clearTimeout(scrollDownTimeout);

    // the first time we wait 10 secons to show  the call to action. If
    // it was already started but the user didn't scrolled enough yet,
    // we show it quickly until he reaches a point where we don't show
    // it anymore
    scrollDownTimeout = setTimeout(() => {
      mouseTextScrollCallToActionStarted = true;
      text.value = scrollDownText;
      scrollDownTimeout = clearAndDeleteTimeout(scrollDownTimeout);
    }, MOUSE_TEXT_TIMEOUT);
  }

  function checkIfShouldRemoveScrollCallToAction() {
    if (!mouseTextScrollCallToActionFinished) {
      // close to the point where the color explodes below the LR icon
      if (window.scrollY > 160) {
        scrollDownTimeout = clearAndDeleteTimeout(scrollDownTimeout);
        scrollDownAgainTimeout = clearAndDeleteTimeout(scrollDownAgainTimeout);
        text.value = '';
        mouseTextScrollCallToActionStarted = false;
        mouseTextScrollCallToActionFinished = true;
      } else if (mouseTextScrollCallToActionStarted && window.scrollY > lastScrolledY) {
        removeMouseText();
        // if the user scrolled down but not enough and the text has been,
        // already added we just add it again right away
        clearAndDeleteTimeout(scrollDownAgainTimeout);
        scrollDownAgainTimeout = setTimeout(() => {
          if (lastMouseTextEl && mouseTextScrollCallToActionStarted) {
            addMouseText(lastMouseTextEl);
          }
          // cant be lower than 300 because that's the ease
          // we use all around the  mouse text animation. usually values
          // lower than 1300 are not behaving very well
        }, 1000 + 300);
      }
    }
  }

  function addCursorOuterBorder() {
    if (!cursorOuter.value) return;
    cursorOuter.value.style.border = `3px solid ${COLORS.highlight}`;
  }

  function setCursorOuterOriginalState() {
    if (!cursorOuter.value) return;
    const boundingClientRect = cursorOuter.value.getBoundingClientRect();
    cursorOuterOriginalState.width = boundingClientRect.width;
    cursorOuterOriginalState.height = boundingClientRect.height;
    const style = getComputedStyle(cursorOuter.value);
    cursorOuterOriginalState.top = style.top;
    cursorOuterOriginalState.left = style.left;
  }

  function scrollHandler(_e: Event) {
    checkIfShouldRemoveScrollCallToAction();

    cursor.y -= lastScrolledY;
    lastScrolledY = window.scrollY;
    cursor.y += lastScrolledY;

    cursor.x -= lastScrolledX;
    lastScrolledX = window.scrollX;
    cursor.x += lastScrolledX;

    if (isStuck.value) {
      animateCursorEnter(lastTargetEl);
    }
  }

  function mousemoveHandler(e: MouseEvent) {
    handleLrCursorFocus(e);
    updateCursorPosition(e);

    // handle click and drag outside the browser not triggering pointerup
    // https://stackoverflow.com/a/48970682/10526869
    if (e.buttons !== buttons) {
      buttons = e.buttons;
      if (e.buttons === 0) {
        handlePointerUp();
      }
    }
  }

  function handleLrCursorFocus(e: MouseEvent) {
    const el = e.target as HTMLElement;
    if (isAttrActivatedOnElement(el, 'lr-cursor')) {
      const toFocus = (el.querySelector('[lr-cursor-inner]') as HTMLElement) || el;

      if (TO_FOCUS_TAGS_DISABLED.has(toFocus.tagName) && (toFocus as HTMLButtonElement).disabled) return;

      if (!elementsToFocus.has(toFocus)) {
        elementsToFocus.add(toFocus);
      }
    } else if (isStuck.value) {
      animateCursorLeave();
    }
  }

  function handlePointerUp(_e?: PointerEvent) {
    if (!cursorInner.value || !cursorOuter.value) return;
    const tl = gsap.timeline();
    tl.to(cursorInner.value, { scale: 1, background: COLORS.highlight, duration: 0.2 });
    tl.to(cursorOuter.value, { borderColor: COLORS.highlight, duration: 0.2 }, '<');
  }

  function handlePointerDown(_e: PointerEvent) {
    const tl = gsap.timeline();
    if (!cursorInner.value || !cursorOuter.value) return;
    tl.to(cursorInner.value, { scale: 2.1, background: COLORS.highlight2, duration: 0.2 });
    tl.to(cursorOuter.value, { borderColor: COLORS.highlight2, duration: 0.2 }, '<');
  }

  function updateCursorPosition(e: MouseEvent) {
    cursor.x = e.pageX;
    cursor.y = e.pageY;
  }

  function animateCursorEnter(targetEl: HTMLElement) {
    if (!activated.value || !cursorOuter.value || !targetEl) return;
    const targetBox = targetEl.getBoundingClientRect();
    lastTargetBox = targetBox;
    lastTargetEl = targetEl;
    isStuck.value = true;

    const enoughHeight = targetBox.height > 23;

    // ANIMATION 2;
    gsap.killTweensOf(cursorOuter.value, 'x,y,width,height,top,left,opacity,borderWidth,borderRadius');
    gsap.to(cursorOuter.value, {
      duration: 0.2,
      x: targetBox.x + window.scrollX,
      y: targetBox.y + window.scrollY,
      width: targetBox.width,
      height: enoughHeight ? targetBox.height : 1, // if the element is too small we underline instead of surrounding it
      top: enoughHeight ? 0 : targetBox.height - 5,
      left: 0,
      opacity: 1,
      borderWidth: enoughHeight ? '4px' : '2px',
      borderRadius: getComputedStyle(targetEl).borderRadius,
    });
  }

  function animateCursorLeave() {
    if (!activated.value || !cursorOuter.value) return;
    isStuck.value = false;
    gsap.to(cursorOuter.value, {
      duration: 0.2,
      width: cursorOuterOriginalState.width,
      height: cursorOuterOriginalState.width,
      borderRadius: '50%',
      borderWidth: '3px',
      onComplete: () => {
        if (!cursorOuter.value) return;
        cursorOuter.value.style.top = cursorOuterOriginalState.top;
        cursorOuter.value.style.left = cursorOuterOriginalState.left;
      },
    });
  }

  function rafCallback() {
    if (!activated.value || !cursorOuter.value || !cursorInner.value) return;

    gsap.to(cursorInner.value, { x: cursor.x, y: cursor.y, duration: 0 });

    const elToFocus = shiftSet(elementsToFocus);
    if (elToFocus) {
      animateCursorEnter(elToFocus);
    }

    if (isStuck.value) return;

    // ANIMATION 1;
    gsap.to(cursorOuter.value, {
      duration: 0.5,
      x: cursor.x - cursorOuterOriginalState.width / 2,
      y: cursor.y - cursorOuterOriginalState.height / 2,
    });
  }

  function shiftSet(set: Set<HTMLElement>) {
    for (const v of set) {
      set.delete(v);
      return v;
    }
  }

  return {
    activate,
    rafCallback,
    listeners: {
      mousemove: mousemoveHandler,
      pointerup: handlePointerUp,
      pointerdown: handlePointerDown,
      scroll: scrollHandler,
    },
  };
};
export default useCursor;
