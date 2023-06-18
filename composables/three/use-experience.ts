import { Mesh, Scene } from 'three';

import useSizes from './use-sizes';
import useCamera from './use-camera';
import useResources from './use-resources';
import useWorld from './world/use-world';
import useRenderer from './use-renderer';
import useLil from './use-lil';
import useTime from './use-time';
import sources from '~/utils/three-leonardorick/sources';

import type { ExperienceModel } from '~/types/three-leonardorick/experience.model';
import type { CameraModel } from '~/types/three-leonardorick/camera.model';
import type { RendererModel } from '~/types/three-leonardorick/renderer.model';
import type { WorldModel } from '~/types/three-leonardorick/world.model';

function useExperience(canvas: HTMLCanvasElement) {
  const self: ExperienceModel = {
    canvas,
    debug: useLil(),
    sizes: useSizes(),
    time: useTime(),
    scene: new Scene(),
    resources: useResources(sources),
    camera: {} as CameraModel,
    renderer: {} as RendererModel,
    world: {} as WorldModel,
    resize: () => {
      self.camera.resize();
      self.renderer.resize();
    },
    update: () => {
      self.camera.update();
      self.renderer.update();
      self.world.update();
    },
    destroy: () => {
      self.scene.traverse((child) => {
        // some tricks to dispose everything we can
        if (child instanceof Mesh) {
          child.geometry.dispose();
          for (const key in child.material) {
            const value = child.material[key];
            // We even check if dispose exists on all values and runs it when it exists
            if (value && typeof value.dispose === 'function') {
              value.dispose();
            }
          }
        }
      });
      self.camera.controls.dispose();
      self.renderer.instance.dispose();
      self.debug.dispose();
      // you can also remove the canvas from the DOM if you want, but it's not mandatory
      // since what remains on the screen is just the last frame that was rendered
      self.canvas.remove();
    },
  };

  self.camera = useCamera(self);
  self.renderer = useRenderer(self);
  self.world = useWorld(self);

  // watchers
  watch([self.sizes.width, self.sizes.height], self.resize);

  watch(self.time.tick, self.update);

  watch(self.debug.active, (curr) => {
    self.debug.setDebug(curr);
    self.world.fox.setDebug();
    self.world.environment.setDebug();
    self.camera.controls.enabled = curr;
  });

  return self;
}

export default useExperience;
