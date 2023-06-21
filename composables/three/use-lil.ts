import { GUI } from 'lil-gui';

const useLil = () => {
  const active = computed(() => useRoute().hash === '#debug');
  const self = {
    active,
    ui: {} as GUI,
    dispose: () => {
      if (self.ui) {
        self.ui.destroy();
      }
    },
    setDebug(show: boolean) {
      if (!objectNotEmpty(self.ui)) {
        self.ui = new GUI();
      }
      self.ui.show(show);
    },
  };

  self.setDebug(active.value);
  return self;
};

export default useLil;
