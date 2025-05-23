/* tslint:disable */
/* eslint-disable */
/**
 * ? This file was automatically generated by Payload.
 * ? DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * ? and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {
  collections: {
    tags: Tag;
    users: User;
    media: Media;
    recommendations: Recommendation;
    quotes: Quote;
    people: Person;
  };
  globals: {};
}
export interface User {
  id: string;
  name?: string;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string;
  resetPasswordExpiration?: string;
  salt?: string;
  hash?: string;
  loginAttempts?: number;
  lockUntil?: string;
  password?: string;
}
export interface Tag {
  id: string;
  name?: string;
}
export interface Media {
  id: string;
  cloudinary?: {
    public_id?: string;
    original_filename?: string;
    format?: string;
    secure_url?: string;
    resource_type?: string;
  };
  updatedAt: string;
  createdAt: string;
  url?: string;
  filename?: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
  sizes?: {
    thumbnail?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
    sixteenByNineMedium?: {
      url?: string;
      width?: number;
      height?: number;
      mimeType?: string;
      filesize?: number;
      filename?: string;
    };
  };
}
export interface Recommendation {
  id: string;
  recommendation?: string;
  author?: string | Person;
  updatedAt: string;
  createdAt: string;
}
export interface Person {
  id: string;
  name: string;
  description: string;
  linkedIn: string;
  image: Media;
  updatedAt: string;
  createdAt: string;
}
export interface Quote {
  id: string;
  quote?: string;
  author?: string;
  updatedAt: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  site: string;
  image: Media;
}
