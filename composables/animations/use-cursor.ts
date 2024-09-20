import { COLORS } from '~/utils/constants/colors';
import { gsap } from 'gsap';
import { useAnimationStore } from '~/store/animation';
import { useAppStore } from '~/store';

const cursor = {
  x: -100,
  y: -100,
};
const cursorOuterOriginalState = {
  width: 48,
  height: 48,
};

const MOUSE_TEXT_TIMEOUT = 10000;
const SCROLL_DOWN_TEXT_KEY = 'scroll_down';
const CURSOR_WORD_CLASS = 'cursor-word';
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
let removedWithoutAddAgain = false;
// each different text we want to add should have a
// block flag to we don't overwide the text with
// another while it's still working it's logic
let mouseTextScrollCallToActionStarted = false;
let mouseTextScrollCallToActionFinished = false;

const elementsToFocus = new Set<HTMLElement>();

const useCursor = () => {
  const $t = useNuxtApp().$i18n.t;
  const { cursorOuter, cursorInner, isCursorActivated: activated } = toRefs(useAnimationStore());
  const { lang } = toRefs(useAppStore());
  const route = useRoute();
  const text = ref('');
  let isStuck = ref(false);
  let scrollDownText = $t(SCROLL_DOWN_TEXT_KEY); // todo: translate

  function activate() {
    if (!cursorOuter.value) return;
    setCursorOuterOriginalState();
    listenToMouseText();
    addScrollCallToAction();

    activated.value = true;
  }

  function listenToMouseText() {
    const unwwatch = watch(lang, () => {
      if (!mouseTextScrollCallToActionFinished) {
        scrollDownText = $t(SCROLL_DOWN_TEXT_KEY);
        if (mouseTextScrollCallToActionStarted) {
          text.value = scrollDownText;
        } else {
          addScrollCallToAction();
        }
      } else {
        unwwatch();
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

      if (!removedWithoutAddAgain && lastMouseTextEl) {
        cursorOuter.value.removeChild(lastMouseTextEl);
      }

      if (!isStuck.value) {
        mouseTextEl.style.opacity = '1';
        cursorOuter.value.style.border = 'none';
      }
      lastMouseTextEl = mouseTextEl;
      removedWithoutAddAgain = false;
    }, 300);
  }

  function removeMouseText(del = false) {
    if (!lastMouseTextEl || removedWithoutAddAgain) return;
    lastMouseTextEl.style.opacity = '0';

    removedWithoutAddAgain = true;
    if (removeTextTimeout) clearTimeout(removeTextTimeout);
    removeTextTimeout = setTimeout(() => {
      if (!cursorOuter.value) return;

      lastMouseTextEl && cursorOuter.value.removeChild(lastMouseTextEl);
      addCursorOuterBorder();

      if (del) {
        lastMouseTextEl = null;
      }
    }, 300);
  }

  function addScrollCallToAction() {
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

  function removeScrollCallToAction() {
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
        clearAndDeleteTimeout(scrollDownAgainTimeout);
        scrollDownAgainTimeout = setTimeout(() => {
          // we can be sure that lastMouseTextEl is 'scroll down' because
          // blockMouseTextScrolCallToAction is true
          if (lastMouseTextEl && mouseTextScrollCallToActionStarted) {
            addMouseText(lastMouseTextEl);
          }
          // cant be lower than 300 because that's the ease
          // we use all around the  mouse text animation
        }, MOUSE_TEXT_TIMEOUT / 10 + 300);
      }
    }
  }

  function addCursorOuterBorder() {
    if (!cursorOuter.value) return;
    cursorOuter.value.style.border = `3px solid ${COLORS.highlight}`;
  }

  watch(
    () => route.path,
    () => {
      if (!activated.value || !cursorOuter.value) return;
      gsap.to(cursorOuter.value, {
        duration: 0,
        x: lastTargetBox.x,
        y: lastTargetBox.y,
      });
    }
  );

  function setCursorOuterOriginalState() {
    if (!cursorOuter.value) return;
    const boundingClientRect = cursorOuter.value.getBoundingClientRect();
    cursorOuterOriginalState.width = boundingClientRect.width;
    cursorOuterOriginalState.height = boundingClientRect.height;
  }

  function scrollHandler(_e: Event) {
    removeScrollCallToAction();

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
    const el = e.target as HTMLElement;
    const attr = el.attributes.getNamedItem('lr-cursor');
    if (attr) {
      if (!elementsToFocus.has(el)) {
        elementsToFocus.add(el);
      }
    } else if (isStuck.value) {
      animateCursorLeave();
    }

    updateCursorPosition(e);
    // handle click and drag not triggering pointerup
    // https://stackoverflow.com/a/48970682/10526869
    if (e.buttons !== buttons) {
      buttons = e.buttons;
      if (e.buttons === 0) {
        handlePointerUp();
      }
    }
  }

  function handlePointerUp(_e?: PointerEvent) {
    if (!cursorInner.value) return;
    gsap.to(cursorInner.value, { scale: 1, duration: 0.2 });
  }

  function handlePointerDown(_e: PointerEvent) {
    if (!cursorInner.value) return;
    gsap.to(cursorInner.value, { scale: 2.1, duration: 0.2 });
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

    // ANIMATION 2;
    gsap.killTweensOf(cursorOuter.value);
    gsap.to(cursorOuter.value, {
      duration: 0.2,
      x: targetBox.x + window.scrollX,
      y: targetBox.y + window.scrollY,
      width: targetBox.width,
      height: targetBox.height,
      opacity: 1,
      borderRadius: getComputedStyle(targetEl).borderRadius,
    });
  }

  function animateCursorLeave() {
    if (!activated.value || !cursorOuter.value) return;
    isStuck.value = false;
    console.log('wtf?');
    gsap.to(cursorOuter.value, {
      duration: 0.2,
      width: cursorOuterOriginalState.width,
      height: cursorOuterOriginalState.width,
      borderRadius: '50%',
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
