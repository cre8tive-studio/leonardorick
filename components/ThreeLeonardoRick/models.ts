import type {
  DirectionalLight,
  AmbientLight,
  CameraHelper,
  Mesh,
  Vector3,
  Group,
  Object3DEventMap,
  Euler,
  Material,
} from 'three';
import type { Reflector } from 'three/examples/jsm/objects/Reflector.js';

export enum GLTFModelKeys {
  top = 'Parte_Superior_Logo',
  center = 'Parte_Central_Logo',
  bottom = 'Parte_Inferior_Logo',
  all = 'all',
  clone = 'clone',
}

interface GltfModel {
  mesh: Mesh | Group<Object3DEventMap> | null;
  finalPosition: Vector3 | null;
  finalScale?: Vector3 | null;
  finalRotation?: Euler | null;
  name: GLTFModelKeys;
}

export interface ThreeGltfModel {
  initialMaterial: Material | null;
  backgroundMaterial: Material | null;
  instances: Record<GLTFModelKeys, GltfModel>;
}
export interface LightsModel {
  [key: string]: {
    light: DirectionalLight | AmbientLight;
    label: string;
    helper: CameraHelper | null;
    initial: {
      position?: {
        x: number;
        y: number;
        z: number;
      };
      intensity: number;
    };
  };
}

export interface FloorModel {
  self: {
    mesh: Reflector | null;
    finalPosition: Vector3 | null;
    finalScale: Vector3 | null;
  };
  mat: Mesh | null;
}

export interface GsapAnimationsModel {
  motion: gsap.core.Timeline | null;
  overlay: gsap.core.Timeline | null;
}
