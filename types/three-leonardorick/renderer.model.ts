import { Scene, WebGLRenderer } from 'three';
import { CameraModel } from './camera.model';
import { SizesModel } from './sizes.model';

export interface RendererModel {
  canvas: HTMLCanvasElement;
  sizes: SizesModel;
  scene: Scene;
  camera: CameraModel;
  instance: WebGLRenderer;

  resize: () => void;
  update: () => void;
}
