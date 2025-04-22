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
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  AmbientLight,
  Euler,
  Group,
  DoubleSide,
  Clock,
  type Object3DEventMap,
  WebGLRenderer,
} from 'three';
import { minimalSetup, isMesh, isDirectionalLight } from '@leonardorick/three';
import { Pane } from 'tweakpane';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'gsap';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { normalize } from '@leonardorick/utils';
import useFluid from './use-fluid';
import { useAnimationStore } from '~/store/animation';
import type {
  LightsModel,
  ThreeGltfModel,
  FloorModel,
  GsapAnimationsModel,
} from '~/types/animations/leonardorick.models';
import { GLTFModelKeys } from '~/types/animations/leonardorick.models';
import lr from '~/assets/models/lr.glb';
import galaxyTexture from '~/assets/textures/environmentMaps/galaxy.jpg';

const useLeonardoRick = () => {
  const MODEL_POSITION_Y_CORRECTION = 0.3;
  const FLOOR_MAT_FINAL_OPACITY = 0.983;
  const AMBIENT_LIGHT_GENERAL_INTENSITY = 310;

  const { isMobile } = useDevice();
  const store = useAnimationStore();
  const { isEnteringAnimationFinished, isLRModelLoaded, loadingProgress, loadingTotal } = toRefs(store);
  const { fluidExplosion } = useFluid();
  const route = useRoute();

  const activated = ref(false);

  const lights: LightsModel = {
    dLight1: {
      light: getDirectionalLight(),
      helper: null,
      label: 'Light 1',
      initial: {
        position: {
          x: 4.5,
          y: 4.5,
          z: 1,
        },
        intensity: 300,
      },
    },
    dLight2: {
      light: getDirectionalLight(),
      helper: null,
      label: 'Light 2',
      initial: {
        position: {
          x: -4.5,
          y: 4.5,
          z: 0.8,
        },
        intensity: 600,
      },
    },
    mouseLight: {
      light: getDirectionalLight(),
      helper: null,
      label: 'Mouse',
      initial: {
        position: {
          x: 0,
          y: 0.5,
          z: 3,
        },
        intensity: 0,
      },
    },
    ambientLight: {
      light: new AmbientLight(),
      helper: null,
      label: 'Ambient light',
      initial: {
        intensity: 0,
      },
    },
  };

  const gltfModel: ThreeGltfModel = {
    initialMaterial: null,
    backgroundMaterial: null,
    instances: {
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
      [GLTFModelKeys.all]: {
        name: GLTFModelKeys.all,
        mesh: null,
        finalPosition: null,
        finalRotation: null,
      },
      [GLTFModelKeys.clone]: {
        name: GLTFModelKeys.clone,
        mesh: null,
        finalPosition: null,
      },
    },
  };

  const gsapAnimations: GsapAnimationsModel = {
    motion: null,
    overlay: null,
  };
  const floor: FloorModel = {
    self: {
      mesh: null,
      finalPosition: null,
      finalScale: null,
    },
    mat: null,
  };
  /**
   * ~ paralax
   */
  const clock = new Clock();
  const cursor = reactive({ x: 0, y: 0 });
  const AMPLITUDE_X = 0.4;
  const AMPLITUDE_Y = 0.4;
  const FRACTION = 2;
  let previousTime = 0;
  let normalizedCursorDistanceFromCenter = 0;

  /**
   * ~ scrolling
   */
  const MOUSE_LIGHT_INTENSITY_AFTER_ENTERING = 0.13;
  const ENTERING_ANIMATION_SCROLL_POSITION = 210;
  const isAnimatingEntering = ref(false);
  const shouldBlock3DScroll = ref(false);
  let INITIAL_CAMERA_POSITION: Vector3;
  let INITIAL_CAMERA_ROTATION: Euler;
  const getRealScrollTop = () => document.documentElement.scrollTop;
  const getScrollTop = () => {
    const realScrollTop = getRealScrollTop();
    return realScrollTop > ENTERING_ANIMATION_SCROLL_POSITION
      ? realScrollTop - ENTERING_ANIMATION_SCROLL_POSITION
      : realScrollTop;
  };

  const getCenterToLookAt = (center: Vector3) => {
    const position = center.clone();
    return position;
  };

  const lightTarget = new Object3D();
  let thisCamera: Camera;
  let thisScene: Scene;
  let thisPane: Pane;
  let thisRenderer: WebGLRenderer;

  /**
   * public methods
   */

  async function activate(isDebug: boolean) {
    const { renderer, scene, camera, controls } = minimalSetup({
      canvasId: 'logoLeonardoRick',
      enableOrbitControl: false,
      addMeshOnScene: false,
      antialias: true,
      powerPreference: 'default',
      orbitControlHandleOnlyCanvasEvents: true,
      allowFullScreen: isDebug,
      // styles: {
      //   position: 'absolute',
      // },
    });

    thisScene = scene;
    thisRenderer = renderer;

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
    await loadModel(scene, camera);
    setupCamera(camera);
    setupPane(isDebug);

    animateEnteringIfnotOnHome();
    activated.value = true;
  }

  function rafCallback() {
    if (!thisCamera || !thisRenderer || !thisCamera || !activated.value) {
      return;
    }
    /**
     * after entering we don't want to scroll anymore, so anything
     * that should happnen only outside this control flag
     */
    if (!shouldBlock3DScroll.value) {
      if (
        getRealScrollTop() > ENTERING_ANIMATION_SCROLL_POSITION - 50 &&
        !isAnimatingEntering.value &&
        !isEnteringAnimationFinished.value
      ) {
        isAnimatingEntering.value = true;

        animateEntering();
      }

      /**
       * Scroll behaviour
       */
      const scrollTop = getScrollTop();
      if (scrollTop) {
        thisCamera.position.z = -scrollTop * 0.0015 + (INITIAL_CAMERA_POSITION?.z || 3);
        // center lookAt needs to happen before camera rotation, if not the rotation will not happen.
        // since it was buggy I commennted and going to try again later
        // c.rotation.z = -scrollTop * 0.001;
      }
    }

    if (!isMobile) {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - previousTime;
      previousTime = elapsedTime;
      const parallaxX = cursor.x * AMPLITUDE_X;
      const parallaxY = (-cursor.y + MODEL_POSITION_Y_CORRECTION) * AMPLITUDE_Y;
      thisCamera.position.x += (parallaxX - thisCamera.position.x) * FRACTION * deltaTime;
      thisCamera.position.y += (parallaxY - thisCamera.position.y) * FRACTION * deltaTime;

      const center = gltfModel.instances[GLTFModelKeys.center].mesh;
      if (center) {
        thisCamera.lookAt(getCenterToLookAt(center.position));
      }
    }

    thisRenderer.render(thisScene, thisCamera);
  }
  /**
   * private methods
   */

  function animateEnteringIfnotOnHome() {
    if (route.path !== '/') {
      animateEntering();
    } else {
      const unwatch = watch(
        () => route.path,
        () => {
          if (isEnteringAnimationFinished.value) {
            unwatch();
            return;
          }

          if (route.path !== '/') {
            animateEntering();
            unwatch();
          }
        }
      );
    }
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

  function animateEntering() {
    const tl = gsap.timeline({
      onComplete: () => {
        shouldBlock3DScroll.value = true;
        thisCamera.position.copy(INITIAL_CAMERA_POSITION);
        thisCamera.rotation.copy(INITIAL_CAMERA_ROTATION);

        if (all.mesh) {
          all.mesh.scale.set(0, 0, 0);
        }

        isAnimatingEntering.value = false;
        isEnteringAnimationFinished.value = true;

        if (thisPane) {
          thisPane.refresh();
        }
      },
    });

    const clone = gltfModel.instances[GLTFModelKeys.clone];
    const all = gltfModel.instances[GLTFModelKeys.all];
    if (clone.mesh && clone.finalScale && gsapAnimations.motion && gsapAnimations.overlay) {
      gsapAnimations.motion.pause();
      gsapAnimations.overlay.pause();
      thisCamera.updateMatrixWorld();
      thisCamera.updateMatrix();

      tl
        // hide main model
        .to(gltfModel.initialMaterial, {
          duration: 0.4,
          opacity: 0,
          onComplete: () => {
            fluidExplosion();
            turnOffLights();
            // uncomment if adding  floot again
            // if (logoCanvas.value) {
            //   logoCanvas.value.style.zIndex = '-1';
            // }
          },
        });

      // uncomment if adding floor again
      // if (floor.mat && floor.self.mesh) {
      //   // hide floor
      //   tl.to(floor.self.mesh.scale, { x: 0, y: 0, z: 0 }, '<')
      //     // hide mat
      //     .to(
      //       floor.mat.material,
      //       {
      //         opacity: 0,
      //       },
      //       '<'
      //     );
      // }

      if (lights.mouseLight && lights.ambientLight) {
        // decrease mouse light
        tl.to(lights.mouseLight.light, { intensity: MOUSE_LIGHT_INTENSITY_AFTER_ENTERING }, '<')
          // add ambient light with the exact strength so it look like the backgorund
          .to(
            lights.ambientLight.light,
            {
              intensity: AMBIENT_LIGHT_GENERAL_INTENSITY,
            },
            '<'
          );
      }
      // show clone scaling it and adding opacity to it material
      tl.to(
        clone.mesh.scale,
        {
          x: clone.finalScale.x,
          y: clone.finalScale.y,
          z: clone.finalScale.z,
          onComplete: () => {
            if (gltfModel.backgroundMaterial) {
              gltfModel.backgroundMaterial.opacity = 1;
            }
          },
        },
        '<'
      );
    }
  }

  function setupLights(scene: Scene) {
    for (const { light, initial } of Object.values(lights)) {
      if (initial.position) {
        const { x, y, z } = initial.position;
        light.position.set(x, y, z);
      }
      light.intensity = initial.intensity;
      scene.add(light);
    }
    // seutup target for mouseLight so can make it follow mouse
    if (!lights.mouseLight) return;
    const mouseLight = lights.mouseLight.light as DirectionalLight;
    scene.add(lights.mouseLight.light);
    mouseLight.target = lightTarget;
    lightTarget.position.set(0, 0 + MODEL_POSITION_Y_CORRECTION, 0);
    mouseLight.target.updateMatrixWorld();
  }

  function turnOffLights() {
    for (const { light } of Object.values(lights)) {
      light.intensity = 0;
    }
  }

  function setupCamera(camera: Camera) {
    camera.position.z -= 0.5;
    INITIAL_CAMERA_POSITION = camera.position.clone();
    INITIAL_CAMERA_ROTATION = camera.rotation.clone();
    thisCamera = camera;
  }

  async function loadModel(scene: Scene, camera: Camera) {
    /**
     * setup floor
     */
    const plane = new PlaneGeometry(1.9, 6.5);
    const Z_POSITION = 3;
    const X_ROTATION = -Math.PI / 2 + 0.1;
    floor.self.mesh = new Reflector(plane, {
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio,
    });
    floor.self.mesh.position.set(0, -0.95, Z_POSITION);
    floor.self.mesh.rotateX(X_ROTATION);
    floor.self.finalPosition = floor.self.mesh.position.clone();
    floor.self.finalScale = floor.self.mesh.scale.clone();
    // scene.add(floor.self.mesh); // ? uncomment to add floor

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
    // scene.add(floor.mat); // ? uncomment to add floor mat

    /**
     * load model
     */
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
      transparent: true,
      side: DoubleSide,
    });

    gltfModel.initialMaterial = standardMaterial;

    const loader = new GLTFLoader(getLoadingManager());
    const gltf = await loader.loadAsync(lr);

    gltf.scene.traverse((child) => {
      if (isMesh(child) && child.isMesh) {
        const piece = gltfModel.instances[child.name as GLTFModelKeys];

        piece.mesh = child;
        piece.finalPosition = child.position.clone();
        piece.finalScale = child.scale;

        child.material = standardMaterial;
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.needsUpdate = true;
      }
    });

    const all = gltfModel.instances[GLTFModelKeys.all];
    all.mesh = gltf.scene;
    all.finalPosition = gltf.scene.position.clone();
    all.finalRotation = gltf.scene.rotation.clone();
    all.finalScale = gltf.scene.scale.clone();

    gltf.scene.rotation.x = Math.PI / 2;
    gltf.scene.position.y = MODEL_POSITION_Y_CORRECTION;

    const center = gltfModel.instances[GLTFModelKeys.center].mesh;
    if (center) {
      camera.lookAt(getCenterToLookAt(center.position));

      if (!lights.dLight1 || !lights.dLight2) return;
      lights.dLight1.light?.lookAt(center.position);
      lights.dLight2.light?.lookAt(center.position);
    }
    scene.add(gltf.scene);
    createClone(gltf.scene);
    /**
     * alternative to reflector (clone gltf and place as mirror)
     */
    // const gltfReflection = gltf.scene.clone();
    // const basicReflectionMaterial = new MeshBasicMaterial({
    //   // color: '#08081c',
    //   color: '#080817',
    //   transparent: true,
    //   // opacity: FLOOR_MAT_FINAL_OPACITY,
    //   opacity: 1,
    //   // preserve real color and block tone mapping that mess with it
    //   // https://github.com/mrdoob/three.js/issues/9603
    //   toneMapped: false,
    // });
    // gltfReflection.traverse((child) => {
    //   if (isMesh(child) && child.isMesh) {
    //     child.material = basicReflectionMaterial;
    //   }
    // });
    // gltfReflection.rotation.x = -Math.PI / 2 + -0.2;
    // // gltfReflection.position.x = 0.025;
    // gltfReflection.position.y = -1.15;
    // gltfReflection.position.z = 0.17;
    // gltfReflection.scale.set(1, 0.9, 0.9);
    setupGsapModelMotionAnimation();
  }

  function createClone(scene: Group<Object3DEventMap>) {
    const physicalMaterial = new MeshPhysicalMaterial({
      color: '#060615',
      metalness: 0.99,
      roughness: 0.36,
      // wireframe: true,
      // preserve real color and block tone mapping that mess with it
      // https://github.com/mrdoob/three.js/issues/9603
      toneMapped: false,
      transparent: true,
      side: DoubleSide,
      opacity: 0,
    });

    gltfModel.backgroundMaterial = physicalMaterial;
    const clone = gltfModel.instances[GLTFModelKeys.clone];
    clone.mesh = scene.clone();
    clone.mesh.traverse((child) => {
      if (isMesh(child) && child.isMesh) {
        child.material = physicalMaterial;
      }
    });
    clone.finalScale = clone.mesh.scale.clone();
    clone.mesh.position.y -= MODEL_POSITION_Y_CORRECTION - 0.1;
    clone.finalScale.set(1.4, 1.4, 1.4);
    clone.mesh.scale.set(0, 0, 0);
    thisScene.add(clone.mesh);
  }

  function getLoadingManager() {
    const manager = new LoadingManager();
    // calls when finish loading
    manager.onLoad = () => {
      isLRModelLoaded.value = true;
      setupGsapLoadingAnimation();
    };

    // calls during loading
    manager.onProgress = (_url, itemsLoaded, itemsTotal) => {
      loadingProgress.value = itemsLoaded;
      loadingTotal.value = itemsTotal;
    };
    return manager;
  }

  /**
   * this is the animation that happesn to fade in the logo on the screen
   * and hide the overlay
   */
  function setupGsapLoadingAnimation() {
    const FADE_IN_DURATION = 2;

    const tl = gsap.timeline({
      onComplete: () => {
        if (thisPane) {
          thisPane.refresh();
        }
      },
    });

    gsapAnimations.overlay = tl;
    if (!lights.mouseLight) return;

    tl.set(lights.mouseLight.light, { intensity: 0 })

      .to(
        lights.mouseLight.light,
        {
          duration: FADE_IN_DURATION,
          intensity: 20,
        },
        '<'
      )
      .to(lights.mouseLight.light, { duration: 3, intensity: 10 }, '<');
  }

  /**
   * this is the entering animation that happens to build the logo and to make
   * the logo keep moving and softly changing its position
   */
  function setupGsapModelMotionAnimation() {
    const tl = gsap.timeline();

    const bottom = gltfModel.instances[GLTFModelKeys.bottom];
    const center = gltfModel.instances[GLTFModelKeys.center];
    const top = gltfModel.instances[GLTFModelKeys.top];
    if (bottom.mesh && bottom.finalPosition && top.mesh && top.finalPosition && center.mesh && center.finalScale) {
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

      if (floor.self.mesh && floor.self.finalPosition && floor.mat) {
        // give space to the bottom part enter without being cutted
        tl.set(floor.self.mesh.position, { x: 0.6 });
        tl.set(floor.mat.position, { x: 0.6 });

        tl.set(top.mesh.position, { x: 10 });
        tl.set(top.mesh.position, { z: -10 });
        tl.set(center.mesh.scale, { x: 0, y: 0, z: 0 });
      }

      tl
        // animate center entering
        .to(center.mesh.scale, { duration: 2, ease: 'back.out(0.4)', ...center.finalScale })

        // animate top of mesh entering
        .to(top.mesh.position, { duration: 2, ease: 'back.out(0.4)', x: top.finalPosition.x }, '-=2')
        .to(top.mesh.position, { duration: 2, ease: 'back.out(0.4)', z: top.finalPosition.z }, '<')

        // animate bottom of mesh entering
        .to(bottom.mesh.position, { duration: 2, ease: 'back.out(0.4)', x: bottom.finalPosition.x }, '-=1.7')
        .to(bottom.mesh.position, { duration: 2, ease: 'back.out(0.4)', z: bottom.finalPosition.z }, '<');

      if (floor.self.mesh && floor.self.finalPosition && floor.mat) {
        // put floor (reflection) on the right place smootly
        tl.to(floor.self.mesh.position, { x: floor.self.finalPosition.x }, '-=0.68').to(
          floor.mat.position,
          { x: floor.self.finalPosition.x },
          '<'
        );
      }

      if (!isMobile) {
        // Slow Oscillating Movement for top mesh
        tl.to(top.mesh.position, { x: '-=0.04', z: '+=0.04', ...OSCILLATING_PROPS })
          .to(bottom.mesh.position, { x: '+=0.04', z: '-=0.04', ...OSCILLATING_PROPS }, '<')
          .to(center.mesh.scale, { x: '-=0.004', z: '-=0.004', ...OSCILLATING_PROPS }, '<');
      }

      gsapAnimations.motion = tl;
    }
  }

  function handleCursorMove($event: MouseEvent) {
    const y = normalize($event.clientY, window.innerHeight, { min: -1, max: 1 });
    cursor.x = normalize($event.clientX, window.innerWidth, { min: -1, max: 1 });
    cursor.y = y;

    if (lights.mouseLight?.light && document.hasFocus()) {
      // don't ask me why it's inverted on x and not on y but it's working like this
      const lightCursorCoord = {
        x: normalize($event.clientX, window.innerWidth, { min: -1, max: 1, inverted: true }),
        y,
      };
      lightTarget.position.set(lightCursorCoord.x, lightCursorCoord.y, 0);
      const mouseLight = lights.mouseLight.light as DirectionalLight;
      mouseLight.updateMatrixWorld();
      // after entering, if mouse is not on center we dont want to show
      // the mouse light, so the background logo really don't appear
      const distanceFromCenter = Math.sqrt(lightCursorCoord.x ** 2 + lightCursorCoord.y ** 2);
      // square of 2 is the max distance from center to any coorder in the given coordinate system, which is
      // the maximum diagonal distance across the square from one corner to the diagonally opposite corner
      const maxDistance = Math.sqrt(2);
      normalizedCursorDistanceFromCenter = distanceFromCenter / maxDistance;
      if (isEnteringAnimationFinished.value) {
        // calculate the Euclidean distance from the center (0, 0)

        const intensity = MOUSE_LIGHT_INTENSITY_AFTER_ENTERING * (1 - normalizedCursorDistanceFromCenter);
        const clampedIntensity = Math.max(0, Math.min(intensity, MOUSE_LIGHT_INTENSITY_AFTER_ENTERING));
        mouseLight.intensity = clampedIntensity;
      }
    }
  }

  function setupPane(isDebug: boolean) {
    if (!isDebug) {
      return;
    }

    const pane = new Pane();
    const positions: (keyof Vector3)[] = ['x', 'y', 'z'];
    const lightEntries = Object.entries(lights);
    for (const [_index, [_, lightInfo]] of lightEntries.entries()) {
      if (lightInfo.light) {
        if (isDirectionalLight(lightInfo.light)) {
          const button = pane.addButton({ title: `Toggle camera helper on light ${lightInfo.label}` });
          button.on('click', () => {
            if (thisScene && lightInfo.light && isDirectionalLight(lightInfo.light)) {
              if (lightInfo.helper) {
                lightInfo.helper.dispose();
                thisScene.remove(lightInfo.helper);
                lightInfo.helper = null;
              } else {
                lightInfo.helper = new CameraHelper(lightInfo.light.shadow.camera);
                thisScene.add(lightInfo.helper);
              }
            }
          });

          for (const position of positions) {
            pane.addBinding(lightInfo.light.position, position, {
              min: -10,
              max: 20,
              step: 0.1,
              label: `${lightInfo.label}: ${position as string}`,
            });
          }
        }
        pane.addBlade({ view: 'separator' });
        pane.addBinding(lightInfo.light, 'intensity', {
          min: 0,
          max: 5000,
          step: 0.01,
          label: `${lightInfo.label} intensity`,
        });
      }
    }

    pane.title = 'Leonardo Rick Logo';
    thisPane = pane;
  }

  onUnmounted(() => {
    if (thisPane) {
      thisPane.dispose();
    }
    isLRModelLoaded.value = false;
    isEnteringAnimationFinished.value = false;
  });

  return {
    activate,
    rafCallback,
    listeners: {
      mousemove: handleCursorMove,
    },
    // to use on template component
    MOUSE_LIGHT_INTENSITY_AFTER_ENTERING,
    lights,
    lightTarget,
    cursor,
    animateEntering,
  };
};

export default useLeonardoRick;
