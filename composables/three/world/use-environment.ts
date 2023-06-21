import { GUI } from 'lil-gui';
import { DirectionalLight, Mesh, MeshStandardMaterial, SRGBColorSpace, Texture } from 'three';
import { PartialWithRequired } from '~/types/partial-with-required';
import { ExperienceModel } from '~/types/three-leonardorick/experience.model';

const useEnvironment = (
  experience: PartialWithRequired<ExperienceModel, ['scene', 'resources', 'debug']>
) => {
  const { scene, resources, debug } = experience;
  const sunLight = getSunLight();
  const environmentMap = getEnvironmentMap();

  let debugFolder: GUI;
  setDebug();

  function setDebug() {
    if (debug.active.value && !debugFolder) {
      debugFolder = debug.ui.addFolder('Environment');
      setSunLightDebug();
      setEnvironmentMapDebug();
    }
  }

  function getSunLight() {
    const sl = new DirectionalLight('#ffffff', 4);
    sl.castShadow = true;
    sl.shadow.camera.far = 15;
    sl.shadow.mapSize.set(1024, 1024);
    sl.shadow.normalBias = 0.05;
    sl.position.set(3, 3, -1.25);
    scene.add(sl);
    return sl;
  }

  function setSunLightDebug() {
    debugFolder.add(sunLight, 'intensity').name('Sun Intensity').step(0.001).min(0).max(10);
    debugFolder.add(sunLight.position, 'x').name('Sun X').step(0.001).min(-5).max(5);
    debugFolder.add(sunLight.position, 'y').name('Sun Y').step(0.001).min(-5).max(5);
    debugFolder.add(sunLight.position, 'z').name('Sun Z').step(0.001).min(-5).max(5);
  }

  function getEnvironmentMap() {
    const envMap = {
      intensity: 1.4,
      texture: {} as Texture,
      updateMaterials: () => {},
    };
    // environmentMapTexture is the name we gave to this item on resources.js
    envMap.texture = resources.items.environmentMapTexture as Texture;
    envMap.texture.colorSpace = SRGBColorSpace;

    scene.environment = envMap.texture;

    envMap.updateMaterials = () => {
      scene.traverse((child) => {
        if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
          // apply the intensity of the environment map to all the materials and meshes
          child.material.envMap = envMap.texture;
          child.material.envMapIntensity = envMap.intensity;

          child.material.needsUpdate = true;
          child.receiveShadow = true;
        }
      });
    };
    envMap.updateMaterials();
    return envMap;
  }

  function setEnvironmentMapDebug() {
    if (objectNotEmpty(environmentMap)) {
      debugFolder
        .add(environmentMap, 'intensity')
        .name('envMapIntensity')
        .step(0.001)
        .min(0)
        .max(10)
        .onChange(environmentMap.updateMaterials);
    }
  }

  return {
    setDebug,
  };
};
export default useEnvironment;
