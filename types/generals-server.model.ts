export interface GeneralsServerModel {
  id: string;
  key: string;
  data: {
    id: string;
    htmlTag: string;
    text: {
      children: {
        text: string;
        bold?: string;
      }[];
    }[];
  }[];
}
