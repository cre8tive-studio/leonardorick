<template>
  <canvas
    id="logo"
    ref="logoCanvas"
  />
</template>
<script setup lang="ts">
import {
  SRGBColorSpace,
  ACESFilmicToneMapping,
  PCFShadowMap,
  DirectionalLight,
  MeshStandardMaterial,
  EquirectangularReflectionMapping,
  TextureLoader,
  Object3D,
  CameraHelper,
  Scene,
  Mesh,
  Vector3,
} from 'three';
import { asyncGltfLoader, minimalSetup, isMesh } from '@leonardorick/three';
import { Pane } from 'tweakpane';
import { normalize } from '@leonardorick/utils';
import lr from '~/assets/models/lr.glb';
import galaxyTexture from '~/assets/textures/environmentMaps/galaxy.jpg';

interface LightsModel {
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
/**
 * data
 */
const lights: LightsModel = {
  dLight1: {
    light: getDirectionalLight(),
    helper: null,
    label: 'Light 1',
    initial: {
      x: 4.5,
      y: 4.5,
      z: 1,
      intensity: 300,
    },
  },
  dLight2: {
    light: getDirectionalLight(),
    helper: null,
    label: 'Light 2',
    initial: {
      x: -4.5,
      y: 4.5,
      z: 0.5,
      intensity: 600,
    },
  },
  mouseLight: {
    light: getDirectionalLight(),
    helper: null,
    label: 'Mouse',
    initial: {
      x: 0,
      y: 0.5,
      z: 3,
      intensity: 10,
    },
  },
};

const lightTarget = new Object3D();
let localScene: Scene;

/**
 * mounted
 */
onMounted(async () => {
  const { renderer, scene, camera } = minimalSetup({
    canvasId: 'logo',
    addMeshOnScene: false,
    antialias: true,
    powerPreference: 'default',
    enableOrbitControl: !isProduction,
    allowFullScreen: false,
    animationCallback: () => {},
  });
  localScene = scene;
  /**
   * RENDERER
   */
  // unsquize the color that was compressed on the linear encoding, giving a more realistic look
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping; // mais bonitinho

  // depends on direcitonalLight.castShadow = true
  // and our materials receiving shadows
  // and  our materials casting shadows
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.toneMappingExposure = 0.8;

  /**
   * LIGHTS
   */
  setupLights(scene);

  /**
   * MODEL
   */
  let center: Mesh;
  const textureLoader = new TextureLoader();
  const environmentMapTexture = textureLoader.load(galaxyTexture);
  environmentMapTexture.mapping = EquirectangularReflectionMapping;

  const standardMaterial = new MeshStandardMaterial({
    color: '#00343d',
    envMapIntensity: 17,
    metalness: 1.15,
    roughness: 0.3,
    envMap: environmentMapTexture,
    emissive: 0x000000, // Add some emissive color if needed
    emissiveIntensity: 0.5, // Increase for more brightness
  });

  const gltf = await asyncGltfLoader(lr);
  gltf.scene.traverse((child) => {
    if (isMesh(child) && child.isMesh) {
      if (child.name === 'Parte_Central_Logo') {
        center = child;
        camera.lookAt(center.position);
        lights.dLight1.light?.lookAt(center.position);
        lights.dLight2.light?.lookAt(center.position);
      }

      child.material = standardMaterial;
      child.castShadow = true;
      child.receiveShadow = true;
      child.material.needsUpdate = true;
    }
  });
  gltf.scene.rotation.x = Math.PI / 2;
  scene.add(gltf.scene);

  const pane = setupPane();
  document.addEventListener('mousemove', documentMousemoveHandler);
  window.LEONARDO_RICK = {
    pane,
    scene,
  };
});

onUnmounted(() => {
  document.removeEventListener('mousemove', documentMousemoveHandler);
});

/**
 * methods
 */
function getDirectionalLight(): DirectionalLight {
  const light = new DirectionalLight('#ffffff', 10);
  light.castShadow = true;
  // optimizes since the shadow don't need to go far from the object. Uncomment camera helper to check
  light.shadow.camera.far = 10;
  light.shadow.mapSize.set(1024, 1024);
  light.shadow.normalBias = 0.05; // fix shadow acne
  return light;
}

const isProduction = useRuntimeConfig().public.environment === 'production';

function documentMousemoveHandler($event: any) {
  if (lights.mouseLight.light && document.hasFocus()) {
    // don't ask me why it's inverted on x and not on y but it's working like this
    const mouseCoordinates = {
      x: normalize($event.clientX, window.innerWidth, { min: -1, max: 1, inverted: true }),
      y: normalize($event.clientY, window.innerHeight, { min: -1, max: 1 }),
    };
    lightTarget.position.set(mouseCoordinates.x, mouseCoordinates.y, 0);
    lights.mouseLight.light.target.updateMatrixWorld();
  }
}

function setupLights(scene: Scene) {
  for (const { light, initial } of Object.values(lights)) {
    light.position.set(initial.x, initial.y, initial.z);
    light.intensity = initial.intensity;
    scene.add(light);
  }
  // seutup target for mouseLight so can make it follow mouse
  lights.mouseLight.light.target = lightTarget;
  lightTarget.position.set(0, 0, 0);
  lights.mouseLight.light.target.updateMatrixWorld();
}

function setupPane(): Pane {
  const pane = new Pane();
  const positions: (keyof Vector3)[] = ['x', 'y', 'z'];
  const lightEntries = Object.entries(lights);
  for (const [index, [_, lightInfo]] of lightEntries.entries()) {
    if (lightInfo.light) {
      for (const position of positions) {
        pane.addBinding(lightInfo.light.position, position, {
          min: -10,
          max: 20,
          step: 0.1,
          label: `${lightInfo.label}: ${position as string}`,
        });
      }
      pane.addBinding(lightInfo.light, 'intensity', {
        min: 0,
        max: 2000,
        step: 5,
        label: `${lightInfo.label} intensity`,
      });
      const button = pane.addButton({ title: `Toggle camera helper on light ${index + 1}` });
      button.on('click', () => {
        if (localScene && lightInfo.light) {
          if (lightInfo.helper) {
            lightInfo.helper.dispose();
            localScene.remove(lightInfo.helper);
            lightInfo.helper = null;
          } else {
            lightInfo.helper = new CameraHelper(lightInfo.light.shadow.camera);
            localScene.add(lightInfo.helper);
          }
        }
      });
    }
  }
  pane.element.style.display = isProduction ? 'none' : 'block';
  pane.title = 'Leonardo Rick Logo';
  return pane;
}
</script>
<style scoped lang="scss">
#logo {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  z-index: -1;
}
</style>
