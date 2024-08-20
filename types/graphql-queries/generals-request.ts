import type { GeneralsServerModel } from '../generals-server.model';

export interface GeneralsRequest {
  Generals: {
    docs: GeneralsServerModel[];
  };
}
