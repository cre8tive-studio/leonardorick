const FPS_CONTROL_KEY_OPTIONS = ['default', 'test'] as const;
export type FPSControlKeyOptions = (typeof FPS_CONTROL_KEY_OPTIONS)[number];

interface runWithControlledFPSOptions {
  key?: FPSControlKeyOptions;
}

const fpsController = {
  default: {
    TRESHOLD: 85,
    SKIP_FRAMES: 1,
  },
  test: {
    TRESHOLD: 70,
    SKIP_FRAMES: 1,
  },
};

const t: number[] = [];
let fps = 60;

/**
 * used ro tun a functoin inside requestAnimationFrame blocking
 * some executions so it matches lower fps rates
 * @param cb function to run
 * @param framersToSkip variable counter that holdes the reference of how many
 * frames were already skipped. it needs to be an object so we have a reference
 * for it's values over multiple executions
 * @param options key of fpsControoller so we know the settings to  apply
 */
export function runWithControlledFPS(
  cb: (...args: any) => void,
  framersToSkip: { value: number },
  { key = 'default' }: runWithControlledFPSOptions = {}
) {
  const controller = fpsController[key];

  if (framersToSkip.value > 0) {
    framersToSkip.value--;
    return;
  }
  if (fps > controller.TRESHOLD) {
    framersToSkip.value = controller.SKIP_FRAMES;
  }
  cb();
}

export function setFPS(now: number) {
  t.unshift(now);
  if (t.length > 10) {
    const t0 = t.pop();
    fps = Math.floor((1000 * 10) / (now - (t0 || 0)));
  }
}
export function getFPS() {
  return fps;
}
