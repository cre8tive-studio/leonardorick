import type { GeneralsServerModel } from '../generals-server.model';

export interface GeneralsResponse {
  Generals: {
    docs: GeneralsServerModel[];
  };
}
