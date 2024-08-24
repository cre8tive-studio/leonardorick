// avoid typescript errors when importing glb files
declare module '*.glb' {
  const value: string;
  export default value;
}

// somehow needed for nuxtApp types to be recognized
declare function useNuxtApp(): NuxtApp;
