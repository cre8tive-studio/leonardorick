const GENERAL_HTML_TAG_OPTIONS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] as const;
export type GeneralHtmlTagOptions = (typeof GENERAL_HTML_TAG_OPTIONS)[number];
export function isGeneralHtmlTag(key: string): key is GeneralHtmlTagOptions {
  return GENERAL_HTML_TAG_OPTIONS.includes(key as GeneralHtmlTagOptions);
}

const GENERAL_KEY_OPTIONS = ['about-me'] as const;
export type GeneralKeyOptions = (typeof GENERAL_KEY_OPTIONS)[number];
export function isGeneralKey(key: string): key is GeneralKeyOptions {
  return GENERAL_KEY_OPTIONS.includes(key as GeneralKeyOptions);
}

export interface GeneralsModel {
  id: string;
  key: GeneralKeyOptions;
  data: {
    id: string;
    htmlTag: GeneralHtmlTagOptions;
    text: {
      text: string;
      bold?: string;
    }[];
  }[];
}
