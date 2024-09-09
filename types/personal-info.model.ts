export interface PersonalInfoModel {
  name: string;
  email: string;
  startWorkingDate: string;
  globalType: 'personalInfo';
  links: {
    linkedin: string;
    github: string;
    stackoverflow: string;
    spotify: string;
  };
  id: string;
}
