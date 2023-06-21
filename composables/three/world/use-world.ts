import useFloor from './use-floor';
import useEnvironment from './use-environment';
import useFox from './use-fox';

import type { ExperienceModel } from '~/types/three-leonardorick/experience.model';
import type { WorldModel } from '~/types/three-leonardorick/world.model';
import type { FoxModel } from '~/types/three-leonardorick/fox.model';
import type { FloorModel } from '~/types/three-leonardorick/floor.model';

const useWorld = (experience: ExperienceModel) => {
  const self: WorldModel = {
    experience,
    floor: {} as FloorModel,
    fox: {} as FoxModel,
    environment: {
      setDebug: () => {},
    },
    update: () => {
      if (objectNotEmpty(self.fox)) {
        self.fox.update();
      }
    },
  };

  watch(experience.resources.loaded, (value) => {
    if (value) {
      self.floor = useFloor(experience);
      self.fox = useFox(experience);
      self.environment = useEnvironment(experience);
    }
  });

  return self;
};

export default useWorld;
