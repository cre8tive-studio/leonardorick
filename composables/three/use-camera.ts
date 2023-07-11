import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { objectNotEmpty } from '../../utils/js-utilities';
import { PartialWithRequired } from '~/types/partial-with-required';
import { CameraModel } from '~/types/three-leonardorick/camera.model';
import { ExperienceModel } from '~/types/three-leonardorick/experience.model';

const useCamera = (
  experience: PartialWithRequired<ExperienceModel, ['sizes', 'scene', 'canvas', 'debug']>
) => {
  const { sizes, scene, canvas, debug } = experience;
  const self: CameraModel = {
    instance: {} as PerspectiveCamera,
    controls: {} as OrbitControls,

    resize: () => {
      self.instance.aspect = sizes.width.value / sizes.height.value;
      self.instance.updateProjectionMatrix();
    },
    update: () => {
      if (objectNotEmpty(self.controls)) {
        self.controls.update();
      }
    },
  };

  setInstance();
  setOrbitControls();

  function setOrbitControls() {
    self.controls = new OrbitControls(self.instance, canvas);
    // make animation smoother when drag and drop
    self.controls.enableDamping = true;
    self.controls.enabled = debug.active.value;
  }

  function setInstance() {
    self.instance = new PerspectiveCamera(35, sizes.pixelRatio.value, 0.1, 100);
    self.instance.position.set(6, 4, 8);
    scene.add(self.instance);
    self.resize();
    self.update();
  }

  return self;
};

export default useCamera;
