export interface PersonalInfoModel {
  email: string;
  globalType: 'personalInfo';
  links: {
    linkedin: string;
    github: string;
    stackoverflow: string;
    spotify: string;
  };
  name: string;
  id: string;
}
