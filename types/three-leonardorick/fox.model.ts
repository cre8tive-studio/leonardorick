import { AnimationAction, AnimationMixer, Object3D } from 'three';

export type FoxAnimationOptions = 'idle' | 'walking' | 'running';
export interface FoxModel {
  instance: Object3D;
  update: () => void;
  animation: {
    name: FoxAnimationOptions;
    mixer: AnimationMixer;
    actions: {
      idle: AnimationAction;
      walking: AnimationAction;
      running: AnimationAction;
      current: AnimationAction;
    };
    play: (name: FoxAnimationOptions) => void;
  };
  setDebug: () => void;
}
