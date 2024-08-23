export interface GeneralsServerModel {
  id: string;
  key: string;
  data: {
    id: string;
    htmlTag: string;
    animationType: string;
    text: {
      children: {
        text: string;
        bold?: string;
      }[];
    }[];
  }[];
}
