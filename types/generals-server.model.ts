export interface GeneralsServerModel {
  id: string;
  key: string;
  data: {
    id: string;
    text: {
      children: {
        text: string;
        bold?: string;
      }[];
    }[];
  }[];
}
