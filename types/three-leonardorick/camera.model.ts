import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export interface CameraModel {
  instance: PerspectiveCamera;
  controls: OrbitControls;
  resize: () => void;
  update: () => void;
}
