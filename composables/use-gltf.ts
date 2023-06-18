import { GLTFLoader } from 'three/examples/jsm//loaders/GLTFLoader';

const useGltf = () => {
  const loader = new GLTFLoader();
  function load(url: string) {
    return new Promise((resolve, reject) => {
      // undefined means we don't want to report progress
      loader.load(url, resolve, undefined, reject);
    });
  }
  return {
    load,
  };
};

export default useGltf;
