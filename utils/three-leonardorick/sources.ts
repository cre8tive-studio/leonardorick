export default [
  {
    name: 'environmentMapTexture',
    loader: 'cubeTextureLoader',
    path: [
      'assets/textures/environmentMaps/5/px.jpg',
      'assets/textures/environmentMaps/5/nx.jpg',
      'assets/textures/environmentMaps/5/py.jpg',
      'assets/textures/environmentMaps/5/ny.jpg',
      'assets/textures/environmentMaps/5/pz.jpg',
      'assets/textures/environmentMaps/5/nz.jpg',
    ],
  },
  {
    name: 'grassColorTexture',
    loader: 'textureLoader',
    path: 'assets/textures/dirt/color.jpg',
  },
  {
    name: 'grassNormalTexture',
    loader: 'textureLoader',
    path: 'assets/textures/dirt/normal.jpg',
  },
  {
    name: 'foxModel',
    loader: 'gltfLoader',
    path: 'assets/models/Fox/Fox.gltf',
  },
] as import('~/types/three-leonardorick/sources.model').SourceModel[];
