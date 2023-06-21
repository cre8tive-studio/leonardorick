import { GUI } from 'lil-gui';
export interface LilModel {
  active: Ref<boolean>;
  ui: GUI;
  dispose: () => void;
  setDebug: (show: boolean) => void;
}
