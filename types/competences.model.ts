const COMPETENCE_NAME_OPTIONS = [
  'vue',
  'python',
  'angular',
  'postman',
  'javascript',
  'threejs',
  'nodejs',
  'react',
  'graphql',
  'typescript',
  'jest',
  'aws',
  'firebase',
  'git',
] as const;
export type CompetenceNameOptions = (typeof COMPETENCE_NAME_OPTIONS)[number];
export interface CompetenceModel {
  name: CompetenceNameOptions;
  icon: string; // the svg itself
  background: string;
  position: {
    x: number | string;
    y: number | string;
  };
  direction: 1 | -1;
  durationOffset?: number;
  rotationOffset?: number;
}
