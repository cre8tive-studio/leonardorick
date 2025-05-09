export interface AudioModel {
  id: string;
  title: string;
  description?: string;
  fileId: string;
  imageUrl?: string;
  appleMusic?: string;
  spotify?: string;
  amazonMusic?: string;
  youtube?: string;
  featured?: boolean;
  number: number;
}
