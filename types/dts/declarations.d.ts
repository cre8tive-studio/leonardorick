// avoid typescript errors when importing glb files
declare module '*.glb' {
  const value: string;
  export default value;
}
