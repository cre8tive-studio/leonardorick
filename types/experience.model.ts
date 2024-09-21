import type { Company } from './payload-types';

export interface ExperienceModel {
  title: string;
  funTitle: string;
  company: Company;
  companyImage?: string;
  year: string;
}
