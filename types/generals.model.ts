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

const GENERAL_ANIMATION_TYPE_OPTIONS = ['none', 'fadeOpacity'] as const;
export type GeneralAnimationTypeOptions = (typeof GENERAL_ANIMATION_TYPE_OPTIONS)[number];
export function isGeneralAnimationType(key: string): key is GeneralAnimationTypeOptions {
  return GENERAL_ANIMATION_TYPE_OPTIONS.includes(key as GeneralAnimationTypeOptions);
}

export interface GeneralsModel {
  id: string;
  key: GeneralKeyOptions;
  data: {
    id: string;
    htmlTag: GeneralHtmlTagOptions;
    animationType: GeneralAnimationTypeOptions;
    text: {
      text: string;
      bold?: string;
    }[];
  }[];
}
