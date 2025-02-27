declare module '*.glb' {
  const value: string;
  export default value;
}

declare module 'three/examples/jsm/loaders/GLTFLoader' {
  import { GLTFLoader as Loader } from 'three/examples/jsm/loaders/GLTFLoader';
  export { Loader as GLTFLoader };
}
