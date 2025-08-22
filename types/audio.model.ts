export interface AudioModel {
  id: string;
  title: string;
  number: number;
  fileId: string;
  description?: string;
  imageUrl?: string;
  appleMusic?: string;
  spotify?: string;
  amazonMusic?: string;
  youtube?: string;
  featured?: boolean;
  lyrics?: string;
  releaseDate?: Date;
}
