import { COLORS } from '~/utils/constants/colors';
import SvgoLogoPython from '~/assets/icons/logo-python.svg';
import SvgoLogoVue from '~/assets/icons/logo-vue.svg';
import SvgoLogoPostman from '~/assets/icons/logo-postman.svg';
import SvgoLogoAngular from '~/assets/icons/logo-angular.svg';
import SvgoLogoJavascript from '~/assets/icons/logo-javascript.svg';
import SvgoLogoThreeJs from '~/assets/icons/logo-threejs.svg';
import SvgoLogoNodeJs from '~/assets/icons/logo-nodejs.svg';
import SvgoLogoGraphql from '~/assets/icons/logo-graphql.svg';
import SvgoLogoTypescript from '~/assets/icons/logo-typescript.svg';
import SvgoLogoReact from '~/assets/icons/logo-react.svg';
import SvgoLogoJest from '~/assets/icons/logo-jest.svg';
import SvgoLogoAWS from '~/assets/icons/logo-aws.svg';
import SvgoLogoFirebase from '~/assets/icons/logo-firebase.svg';
import SvgoLogoGIT from '~/assets/icons/logo-git.svg';

import type { CompetenceModel, CompetenceNameOptions } from '~/types/competences.model';

export const COMPETENCES: Record<CompetenceNameOptions, CompetenceModel> = {
  vue: {
    name: 'vue',
    icon: SvgoLogoVue,
    background: COLORS.mainDarkText,
    position: {
      x: '-24cqw',
      y: '-33cqh',
    },
    direction: -1,
  },
  python: {
    name: 'python',
    icon: SvgoLogoPython,
    background: COLORS.mainDarkText,
    position: {
      x: '19cqw',
      y: '15cqh',
    },
    direction: 1,
    durationOffset: 2,
    rotationOffset: 180,
  },
  postman: {
    name: 'postman',
    icon: SvgoLogoPostman,
    background: '#FF6C37',
    position: {
      x: '-17cqw',
      y: '-6cqh',
    },
    direction: 1,
    durationOffset: -2,
    rotationOffset: 60,
  },
  angular: {
    name: 'angular',
    icon: SvgoLogoAngular,
    background: '#0F0F11',
    position: {
      x: '21cqw',
      y: '-30cqh',
    },
    direction: 1,
    durationOffset: 2,
  },
  javascript: {
    name: 'javascript',
    icon: SvgoLogoJavascript,
    background: '#F7DF1E',
    position: {
      x: '0cqw',
      y: '-42cqh',
    },
    direction: 1,
    durationOffset: 3,
    rotationOffset: 200,
  },
  threejs: {
    name: 'threejs',
    icon: SvgoLogoThreeJs,
    background: COLORS.mainDarkText,
    position: {
      x: '-16cqw',
      y: '18cqh',
    },
    direction: -1,
    durationOffset: 1,
    rotationOffset: 70,
  },
  nodejs: {
    name: 'nodejs',
    icon: SvgoLogoNodeJs,
    background: '#468C45',
    position: {
      x: '16cqw',
      y: '-10cqh',
    },
    direction: -1,
    durationOffset: -1,
    rotationOffset: 180,
  },
  react: {
    name: 'react',
    icon: SvgoLogoReact,
    background: '#222222',
    position: {
      x: '-34cqw',
      y: '-14cqh',
    },
    direction: -1,
    durationOffset: -1,
    rotationOffset: 180,
  },
  graphql: {
    name: 'graphql',
    icon: SvgoLogoGraphql,
    background: '#1B1B1B',
    position: {
      x: '40cqw',
      y: '-22cqh',
    },
    direction: 1,
    durationOffset: -1,
    rotationOffset: 180,
  },
  typescript: {
    name: 'typescript',
    icon: SvgoLogoTypescript,
    background: '#3178C6',
    position: {
      x: '-37.5cqw',
      y: '11cqh',
    },
    direction: 1,
    durationOffset: -1,
    rotationOffset: 0,
  },
  jest: {
    name: 'jest',
    icon: SvgoLogoJest,
    background: '#99424F',
    position: {
      x: '34cqw',
      y: '31cqh',
    },
    direction: -1,
    durationOffset: -2,
    rotationOffset: 90,
  },
  aws: {
    name: 'aws',
    icon: SvgoLogoAWS,
    background: '#2C3641',
    position: {
      x: '1cqw',
      y: '40cqh',
    },
    direction: 1,
    durationOffset: -2,
    rotationOffset: 0,
  },
  firebase: {
    name: 'firebase',
    icon: SvgoLogoFirebase,
    background: '#1E1E1E',
    position: {
      x: '-30.6cqw',
      y: '31cqh',
    },
    direction: -1,
    durationOffset: -2,
    rotationOffset: 0,
  },
  git: {
    name: 'git',
    icon: SvgoLogoGIT,
    background: '#222115',
    position: {
      x: '34cqw',
      y: '0cqh',
    },
    direction: 1,
    durationOffset: -2,
    rotationOffset: 0,
  },
};
