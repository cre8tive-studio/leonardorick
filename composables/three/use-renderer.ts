import { CineonToneMapping, PCFSoftShadowMap, SRGBColorSpace, WebGLRenderer } from 'three';
import { PartialWithRequired } from '~/types/partial-with-required';
import { ExperienceModel } from '~/types/three-leonardorick/experience.model';
import { RendererModel } from '~/types/three-leonardorick/renderer.model';

const useRenderer = (
  experience: PartialWithRequired<ExperienceModel, ['canvas', 'sizes', 'scene', 'camera']>
) => {
  const self: RendererModel = {
    canvas: experience.canvas,
    sizes: experience.sizes,
    scene: experience.scene,
    camera: experience.camera,

    instance: {} as WebGLRenderer,

    resize: () => {
      self.instance.setSize(self.sizes.width.value, self.sizes.height.value);
      // self.instance.setPixelRatio(self.sizes.pixelRatio.value);
      // fix blurry canvas on mobile
      self.instance.setPixelRatio(window.devicePixelRatio);
    },
    update: () => {
      self.instance.render(self.scene, self.camera.instance);
    },
  };

  setInstance();

  function setInstance() {
    self.instance = new WebGLRenderer({
      canvas: self.canvas,
      antialias: true,
      // alpha: true,
    });
    // self.instance.setClearColor('#000000', 0); // transparent background
    self.instance.setClearColor('#000000', 0.4);
    self.instance.outputColorSpace = SRGBColorSpace;
    self.instance.toneMapping = CineonToneMapping;
    self.instance.toneMappingExposure = 1.75;
    self.instance.shadowMap.enabled = true;
    self.instance.shadowMap.type = PCFSoftShadowMap;

    self.resize();
  }
  return self;
};

export default useRenderer;
