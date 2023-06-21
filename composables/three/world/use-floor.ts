import {
  CircleGeometry,
  Mesh,
  MeshStandardMaterial,
  RepeatWrapping,
  SRGBColorSpace,
  Texture,
} from 'three';

import type { PartialWithRequired } from '~/types/partial-with-required';
import type { ExperienceModel } from '~/types/three-leonardorick/experience.model';

const useFloor = (experience: PartialWithRequired<ExperienceModel, ['scene', 'resources']>) => {
  const { resources } = experience;
  const textures = getTextures();
  const instance = setMesh();

  function getTextures() {
    const t = {
      color: resources.items.grassColorTexture as Texture,
      normal: resources.items.grassNormalTexture as Texture,
    };
    setTextureProperties(t.color);
    setTextureProperties(t.normal);
    return t;
  }

  function getMaterial() {
    return new MeshStandardMaterial({
      map: textures.color,
      normalMap: textures.normal,
    });
  }

  function setMesh() {
    const m = new Mesh(new CircleGeometry(5, 64), getMaterial());
    m.rotation.x = -Math.PI * 0.5;
    m.receiveShadow = true;
    experience.scene.add(m);
    return m;
  }

  function setTextureProperties(texture: Texture) {
    texture.colorSpace = SRGBColorSpace;
    texture.repeat.set(1.5, 1.5);
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
  }
  return {
    instance,
  };
};
export default useFloor;
