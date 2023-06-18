export const LOADERS = ['gltfLoader', 'textureLoader', 'cubeTextureLoader'] as const;
export type LoaderOptions = (typeof LOADERS)[number];
