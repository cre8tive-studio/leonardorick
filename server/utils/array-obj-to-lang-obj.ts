import { LANGUAGES, LanguageOptions } from '../../utils/constants/languages';

interface RawGraphQlResponse {
  _id: string;
  text: {
    _key: string;
    value: string;
  }[];
  author?: { name: string };
  authorName?: string;
}

/**
 * basically converts:
  [ { _id, author, text[en, pt-BR]] } ] into
  { en: [id, author, text], pt-BR: [id, author, text] }
 * @param all
 * @returns
 */
export function arrayObjToLangObj<T>(all: RawGraphQlResponse[]): Record<LanguageOptions, T[]> {
  return LANGUAGES.reduce((acc, lang) => {
    const langList = all.reduce((list, query) => {
      list.push({
        id: query._id,
        value: query.text.find((text) => text._key === lang)?.value || '',
        author: query.author?.name || query.authorName,
        lang,
      } as T);

      return list;
    }, [] as T[]);
    acc[lang] = langList;
    return acc;
  }, {} as Record<LanguageOptions, T[]>);
}
