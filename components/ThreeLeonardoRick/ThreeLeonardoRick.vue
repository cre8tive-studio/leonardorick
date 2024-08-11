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
import { gsap } from 'gsap';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import type { LightsModel, ThreeGltfModel, FloorModel } from './models.ts';
import { GLTFModelKeys } from './models';
import lr from '~/assets/models/lr.glb';
import galaxyTexture from '~/assets/textures/environmentMaps/galaxy.jpg';

/**
 * data
 */
const MODEL_POSITION_Y_CORRECTION = 0.5;
const FLOOR_MAT_FINAL_OPACITY = 0.984;

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
      z: 0.8,
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

const gltfModel: Record<GLTFModelKeys, ThreeGltfModel> = {
  [GLTFModelKeys.top]: {
    name: GLTFModelKeys.top,
    mesh: null,
    finalPosition: null,
  },
  [GLTFModelKeys.center]: {
    name: GLTFModelKeys.center,
    mesh: null,
    finalPosition: null,
    finalScale: null,
  },
  [GLTFModelKeys.bottom]: {
    name: GLTFModelKeys.bottom,
    mesh: null,
    finalPosition: null,
  },
};

const floor: FloorModel = {
  self: {
    mesh: null,
    finalPosition: null,
  },
  mat: null,
};

const lightTarget = new Object3D();
const logoOverlay = ref();
let localScene: Scene;
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

      const center = gltfModel[GLTFModelKeys.center].mesh;
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
    roughness: 0.36,
    envMap: environmentMapTexture,
    emissive: 0x000000, // Add some emissive color if needed
    emissiveIntensity: 0.6, // Increase for more brightness
  });

  const loader = new GLTFLoader(getLoadingManager());
  const gltf = await loader.loadAsync(lr);
  gltf.scene.traverse((child) => {
    if (isMesh(child) && child.isMesh) {
      const piece = gltfModel[child.name as GLTFModelKeys];
      piece.mesh = child;
      piece.finalPosition = structuredClone(child.position);

      if (child.name === GLTFModelKeys.center) {
        piece.finalScale = child.scale;
        if (piece.mesh) {
          camera.lookAt(piece.mesh.position);
          lights.dLight1.light?.lookAt(piece.mesh.position);
          lights.dLight2.light?.lookAt(piece.mesh.position);
        }
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
  floor.self.mesh = new Reflector(plane, {
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
  });
  floor.self.mesh.position.set(0, 0.08, Z_POSITION);
  floor.self.mesh.rotateX(X_ROTATION);
  floor.self.finalPosition = structuredClone(floor.self.mesh.position);
  scene.add(floor.self.mesh);

  floor.mat = new Mesh(
    plane,
    new MeshBasicMaterial({
      color: '#060615',
      transparent: true,
      opacity: FLOOR_MAT_FINAL_OPACITY,
      // preserve real color and block tone mapping that mess with it
      // https://github.com/mrdoob/three.js/issues/9603
      toneMapped: false,
    })
  );
  floor.mat.position.set(0, floor.self.mesh.position.y + 0.001, Z_POSITION);
  floor.mat.rotateX(X_ROTATION);
  scene.add(floor.mat);

  setupGsapModelMotionAnimation();
}

function getLoadingManager() {
  const manager = new LoadingManager();
  // calls when finish loading
  manager.onLoad = () => {
    setupGsapLogoLoadingAnimation();
  };

  // calls during loading
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

/**
 * this is the animation that happesn to fade in the logo on the screen
 */
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

/**
 * this is the animation that happens to make the logo keep moving and softly
 * changing its position
 */
function setupGsapModelMotionAnimation() {
  const tl = gsap.timeline();

  // if (floor.mat) {
  //   tl.set(floor.self)
  // }
  const bottom = gltfModel[GLTFModelKeys.bottom];
  const center = gltfModel[GLTFModelKeys.center];
  const top = gltfModel[GLTFModelKeys.top];
  if (
    bottom.mesh &&
    bottom.finalPosition &&
    top.mesh &&
    top.finalPosition &&
    center.mesh &&
    center.finalScale &&
    floor.self.mesh &&
    floor.mat
  ) {
    const OSCILLATING_PROPS = {
      duration: 5.5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    };

    /**
     * set initial values
     */
    tl.set(bottom.mesh.position, { x: -10 });
    tl.set(bottom.mesh.position, { z: 10 });

    tl.set(floor.self.mesh.position, { y: -25 });
    tl.set(floor.mat.material, { opacity: 0 });

    tl.set(top.mesh.position, { x: 10 });
    tl.set(top.mesh.position, { z: -10 });
    tl.set(center.mesh.scale, { x: 0, y: 0, z: 0 });

    tl
      // animate center entering
      .to(center.mesh.scale, { duration: 2, ease: 'back.out(0.4)', ...center.finalScale })

      // animate top of mesh entering
      .to(top.mesh.position, { duration: 2, ease: 'back.out(0.4)', x: top.finalPosition.x }, '-=2')
      .to(top.mesh.position, { duration: 2, ease: 'back.out(0.4)', z: top.finalPosition.z }, '<')

      // animate bottom of mesh entering
      .to(bottom.mesh.position, { duration: 2, ease: 'back.out(0.4)', x: bottom.finalPosition.x }, '-=1.7')
      .to(bottom.mesh.position, { duration: 2, ease: 'back.out(0.4)', z: bottom.finalPosition.z }, '<')

      // Slow Oscillating Movement for top mesh
      .to(top.mesh.position, { x: '-=0.04', z: '+=0.04', ...OSCILLATING_PROPS })
      .to(bottom.mesh.position, { x: '+=0.04', z: '-=0.04', ...OSCILLATING_PROPS }, '<')
      .to(center.mesh.scale, { x: '-=0.004', z: '-=0.004', ...OSCILLATING_PROPS }, '<')

      // put floor (reflection) on the right place smootly
      .to(floor.mat.material, { opacity: 1 }, `-=${OSCILLATING_PROPS.duration}`)
      .to(floor.self.mesh.position, { y: floor.self.finalPosition.y }, '-=0.25')
      .to(floor.mat.material, { duration: 2, opacity: FLOOR_MAT_FINAL_OPACITY })

      // lights animation
      // .to(lights.dLight2.light, { intensity: '+=800', ...OSCILLATING_PROPS, duration: 10 })
      // .to(lights.dLight2.light, { intensity: '+=800', ...OSCILLATING_PROPS, duration: 10 })
      .to(lights.dLight1.light, { intensity: '+=800', ...OSCILLATING_PROPS, duration: 10 }, '-=10')
      .to(lights.dLight1.light, { intensity: '-=800', ...OSCILLATING_PROPS, duration: 10 });
  }
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
