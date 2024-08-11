import type { DirectionalLight, CameraHelper, Mesh, Vector3 } from 'three';
import type { Reflector } from 'three/examples/jsm/objects/Reflector.js';

export enum GLTFModelKeys {
  top = 'Parte_Superior_Logo',
  center = 'Parte_Central_Logo',
  bottom = 'Parte_Inferior_Logo',
}

export interface LightsModel {
  [key: string]: {
    light: DirectionalLight;
    label: string;
    helper: CameraHelper | null;
    initial: {
      x: number;
      y: number;
      z: number;
      intensity: number;
    };
  };
}

export interface ThreeGltfModel {
  mesh: Mesh | null;
  finalPosition: Vector3 | null;
  finalScale?: Vector3 | null;
  name: GLTFModelKeys;
}

export interface FloorModel {
  self: {
    mesh: Reflector | null;
    finalPosition: Vector3 | null;
  };
  mat: Mesh | null;
}
