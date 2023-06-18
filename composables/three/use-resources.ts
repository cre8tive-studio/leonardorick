import { GLTF, GLTFLoader } from 'three/examples/jsm//loaders/GLTFLoader';
import { CubeTextureLoader, Texture, TextureLoader } from 'three';
import { LOADERS } from '~/utils/constants/loaders';

import type { ResourcesModel } from '~/types/three-leonardorick/resources.model';
import type { SourceModel } from '~/types/three-leonardorick/sources.model';

const useResources = (sources: SourceModel[]) => {
  const self: ResourcesModel = {
    items: {},
    loaded: ref(false),
  };
  let alreadyLoadedCount = 0;

  const loaders = {
    gltfLoader: new GLTFLoader(),
    textureLoader: new TextureLoader(),
    cubeTextureLoader: new CubeTextureLoader(),
  };

  startLoading();

  function startLoading() {
    for (const source of sources) {
      if (LOADERS.includes(source.loader)) {
        loadModel(source);
      }
    }

    function loadModel(source: SourceModel) {
      loaders[source.loader].load(source.path, (file) => {
        loadSource(source, file);
      });
    }
    function loadSource(source: SourceModel, file: GLTF | Texture) {
      self.items[source.name] = file;
      alreadyLoadedCount++;
      if (alreadyLoadedCount === sources.length) {
        self.loaded.value = true;
      }
    }
  }

  return self;
};

export default useResources;
