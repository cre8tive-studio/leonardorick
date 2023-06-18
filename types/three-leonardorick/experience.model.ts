import type { Scene } from 'three';
import type { CameraModel } from './camera.model';
import type { RendererModel } from './renderer.model';
import type { ResourcesModel } from './resources.model';
import type { WorldModel } from './world.model';
import type { LilModel } from './lil.model';
import type { SizesModel } from './sizes.model';
import type { TimeModel } from './time.model';

export interface ExperienceModel {
  canvas: HTMLCanvasElement;
  debug: LilModel;
  sizes: SizesModel;
  time: TimeModel;
  scene: Scene;
  resources: ResourcesModel;

  camera: CameraModel;
  renderer: RendererModel;
  world: WorldModel;

  resize: () => void;
  update: () => void;
  destroy: () => void;
}
