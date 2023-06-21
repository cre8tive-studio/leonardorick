import { AnimationAction, AnimationMixer, Mesh } from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import type { PartialWithRequired } from '~/types/partial-with-required';
import type { ExperienceModel } from '~/types/three-leonardorick/experience.model';
import type { FoxAnimationOptions, FoxModel } from '~/types/three-leonardorick/fox.model';

const useFox = (
  experience: PartialWithRequired<ExperienceModel, ['scene', 'resources', 'time', 'debug']>
): FoxModel => {
  const { scene, resources, time, debug } = experience;

  const deltaMultiplierMap: Partial<Record<FoxAnimationOptions, number>> = {
    running: 0.002,
  };

  // Setup
  const source = resources.items.foxModel as GLTF;
  const model = getModel();
  const animation = getAnimation();

  setDebug();

  function getModel() {
    const m = source.scene;
    m.scale.set(0.02, 0.02, 0.02);
    scene.add(m);

    m.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
      }
    });
    return m;
  }

  function getAnimation() {
    const m = {
      name: 'idle' as FoxAnimationOptions,
      mixer: new AnimationMixer(model),
      actions: {
        idle: {} as AnimationAction,
        walking: {} as AnimationAction,
        running: {} as AnimationAction,
        current: {} as AnimationAction,
      },
      play: (name: 'idle' | 'walking' | 'running') => {
        const newAction = m.actions[name];
        const oldAction = m.actions.current;

        newAction.reset();
        newAction.play();
        newAction.crossFadeFrom(oldAction, 1, false);
        m.actions.current = newAction;
        m.name = name;
      },
    };

    m.actions.idle = m.mixer.clipAction(source.animations[0]);
    m.actions.walking = m.mixer.clipAction(source.animations[1]);
    m.actions.running = m.mixer.clipAction(source.animations[2]);

    m.actions.current = m.actions.idle;
    // this.animation.actions.current = this.animation.actions.walking;
    // this.animation.actions.current = this.animation.actions.running
    m.actions.current.play();
    return m;
  }

  function setDebug() {
    if (debug.active.value && !debug.ui.folders.find((f) => f._title === 'Fox')) {
      const debugFolder = debug.ui.addFolder('Fox');
      const debugObject = {
        playIdle: () => {
          animation.play('idle');
        },
        playWalking: () => {
          animation.play('walking');
        },
        playRunning: () => {
          animation.play('running');
        },
      };
      debugFolder.add(debugObject, 'playIdle').name('Play Idle');
      debugFolder.add(debugObject, 'playWalking').name('Play Walking');
      debugFolder.add(debugObject, 'playRunning').name('Play Running');
    }
  }

  function update() {
    const multiplier = deltaMultiplierMap[animation.name] || 0.001;
    animation.mixer.update(time.delta * multiplier);
  }
  return {
    update,
    animation,
    setDebug,
    instance: model,
  };
};
export default useFox;
