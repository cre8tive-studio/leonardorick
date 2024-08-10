<template>
  <canvas
    id="logo"
    ref="logoCanvas"
  />
  <div
    id="logoOverlay"
    ref="logoOverlay"
    class="fixed h-full w-full"
  >
    <div class="loading-bar"></div>
  </div>
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
  Camera,
  Vector3,
  LoadingManager,
  PlaneGeometry,
  Clock,
  MeshBasicMaterial,
} from 'three';
import { minimalSetup, isMesh } from '@leonardorick/three';
import { Pane } from 'tweakpane';
import { normalize } from '@leonardorick/utils';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
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
const MODEL_POSITION_Y_CORRECTION = 0.5;
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
      intensity: 0,
    },
  },
};

const lightTarget = new Object3D();
const logoOverlay = ref();
let localScene: Scene;
let center: Mesh;
let pane: Pane;

/**
 * PARALAX
 */
const cursor = { x: 0, y: 0 };
const clock = new Clock();
const AMPLITUDE_X = 1;
const AMPLITUDE_Y = 0.5;
const FRACTION = 3;
let previousTime = 0;
/**
 * mounted
 */
onMounted(async () => {
  const { renderer, scene, camera, controls } = minimalSetup({
    canvasId: 'logo',
    addMeshOnScene: false,
    antialias: true,
    powerPreference: 'default',
    enableOrbitControl: isDebug,
    orbitControlHandleOnlyCanvasEvents: true,
    allowFullScreen: isDebug,
    styles: {
      position: 'absolute',
    },
    animationCallback: ({ camera: c }) => {
      const elapsedTime = clock.getElapsedTime();

      const deltaTime = elapsedTime - previousTime;
      previousTime = elapsedTime;

      /**
       * PARALAX EFFECT APPLICATION
       */
      const parallaxX = cursor.x * AMPLITUDE_X;
      const parallaxY = (-cursor.y + MODEL_POSITION_Y_CORRECTION) * AMPLITUDE_Y;
      c.position.x += (parallaxX - c.position.x) * FRACTION * deltaTime;
      c.position.y += (parallaxY - c.position.y) * FRACTION * deltaTime;

      if (center) {
        c.lookAt(center.position);
      }
    },
  });

  localScene = scene;
  if (controls) {
    controls.enableZoom = false;
  }
  /**
   * RENDERER
   */
  // unsquize the color that was compressed on the linear encoding, giving a more realistic look
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping; // !!! Be careful with this!!!! it change color

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

  loadModel(scene, camera);
  pane = setupPane();
  // listen the mouse on the hole document so we can track the mouse position
  // and change the mouseLight position based on that even if other div is
  // overlaying it
  document.addEventListener('mousemove', documentMousemoveHandler);
  // setup global variable so we can debug on web
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
async function loadModel(scene: Scene, camera: Camera) {
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

  const loader = new GLTFLoader(getLoadingManager());
  const gltf = await loader.loadAsync(lr);
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
  gltf.scene.position.y = MODEL_POSITION_Y_CORRECTION;
  scene.add(gltf.scene);

  /**
   * setup floor
   */
  const plane = new PlaneGeometry(40, 20);
  const Z_POSITION = -5;
  const X_ROTATION = -Math.PI / 2 + 0.1;
  const floor = new Reflector(plane, {
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
  });
  floor.position.set(0, 0.08, Z_POSITION);
  floor.rotateX(X_ROTATION);
  scene.add(floor);

  const floorMat = new Mesh(
    plane,
    new MeshBasicMaterial({
      color: '#060615',
      // color: 'red',
      transparent: true,
      opacity: 0.986,
      // preserve real color and block tone mapping that mess with it
      // https://github.com/mrdoob/three.js/issues/9603
      toneMapped: false,
    })
  );
  floorMat.position.set(0, floor.position.y + 0.001, Z_POSITION);
  floorMat.rotateX(X_ROTATION);
  scene.add(floorMat);
}

function getLoadingManager() {
  const manager = new LoadingManager();
  manager.onLoad = () => {
    setupGsapLogoLoadingAnimation();
  };

  manager.onProgress = (_url, _itemsLoaded, _itemsTotal) => {
    // console.log(itemsLoaded, itemsTotal);
    // todo: setup loader
  };
  return manager;
}

function getDirectionalLight(): DirectionalLight {
  const light = new DirectionalLight('#ffffff', 10);
  light.castShadow = true;
  // optimizes since the shadow don't need to go far from the object. Uncomment camera helper to check
  light.shadow.camera.far = 10;
  light.shadow.mapSize.set(1024, 1024);
  light.shadow.normalBias = 0.05; // fix shadow acne
  return light;
}

const isDebug = !!Object.prototype.hasOwnProperty.call(useRoute().query, 'debug');

function documentMousemoveHandler($event: any) {
  if (lights.mouseLight.light && document.hasFocus()) {
    // don't ask me why it's inverted on x and not on y but it's working like this
    const y = normalize($event.clientY, window.innerHeight, { min: -1, max: 1 });
    const lightCursorCoord = {
      x: normalize($event.clientX, window.innerWidth, { min: -1, max: 1, inverted: true }),
      y,
    };
    lightTarget.position.set(lightCursorCoord.x, lightCursorCoord.y, 0);
    lights.mouseLight.light.target.updateMatrixWorld();

    cursor.x = normalize($event.clientX, window.innerWidth, { min: -1, max: 1 });
    cursor.y = y;
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
  const _pane = new Pane();
  const positions: (keyof Vector3)[] = ['x', 'y', 'z'];
  const lightEntries = Object.entries(lights);
  for (const [index, [_, lightInfo]] of lightEntries.entries()) {
    if (lightInfo.light) {
      for (const position of positions) {
        _pane.addBinding(lightInfo.light.position, position, {
          min: -10,
          max: 20,
          step: 0.1,
          label: `${lightInfo.label}: ${position as string}`,
        });
      }
      _pane.addBinding(lightInfo.light, 'intensity', {
        min: 0,
        max: 2000,
        step: 5,
        label: `${lightInfo.label} intensity`,
      });
      const button = _pane.addButton({ title: `Toggle camera helper on light ${index + 1}` });
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
  _pane.element.style.display = isDebug ? 'block' : 'none';
  _pane.title = 'Leonardo Rick Logo';
  return _pane;
}

function setupGsapLogoLoadingAnimation() {
  const fadeInDuration = 2;

  gsap.to(logoOverlay.value, {
    duration: fadeInDuration,
    opacity: 0,
    // delay: 0.6,
    onComplete: () => {
      if (logoOverlay.value) {
        // Once the animation is complete, set the display to 'none'
        logoOverlay.value.style.display = 'none';
      }
    },
  });

  const tl = gsap.timeline({
    onComplete: () => {
      if (pane) {
        pane.refresh();
      }
    },
  });
  tl.set(lights.mouseLight.light, { intensity: 0 });
  tl.to(lights.mouseLight.light, {
    duration: fadeInDuration,
    intensity: 30,
    // delay: 0.6,
  });
  tl.to(lights.mouseLight.light, { duration: 3, intensity: 10 });
}
</script>
<style scoped lang="scss">
#logo {
  z-index: -1;
}

#logoOverlay {
  background-color: $main-dark-bg;
}
</style>
