import { isGeneralAnimationType, isGeneralHtmlTag, isGeneralKey, type GeneralsModel } from '~/types/generals.model';
import type { GeneralsResponse } from '~/types/graphql-queries/generals-response';

export function parseGenerals(response: GeneralsResponse): GeneralsModel[] {
  return response.Generals.docs.map(({ data, ...doc }) => ({
    ...doc,
    key: isGeneralKey(doc.key) ? doc.key : 'about-me',
    data: data.map(({ text, ...item }) => ({
      ...item,
      htmlTag: isGeneralHtmlTag(item.htmlTag) ? item.htmlTag : 'p',
      animationType: isGeneralAnimationType(item.animationType) ? item.animationType : 'none',
      text: (text || [])
        // deconstruct children level, flat and return so verything from the same richText
        // will be at the same array level (simplifying the data structure a bit)
        .map(({ children }) => children)
        .flat(1)
        .filter((line) => !!line.text),
    })),
  }));
}

export function getGeneralsFullText(item: GeneralsModel['data'][0] | undefined) {
  if (!item) return '';
  return item.text.reduce((acum, curr) => {
    acum += curr.text;
    return acum;
  }, '');
}
