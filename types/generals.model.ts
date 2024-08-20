export interface GeneralsModel {
  id: string;
  key: string;
  data: {
    id: string;
    text: {
      text: string;
      bold?: string;
    }[];
  }[];
}
