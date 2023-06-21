import type { LoaderOptions } from '~/utils/constants/loaders';

export interface SourceModel {
  name: string;
  loader: LoaderOptions;
  path: string & string[];
}
