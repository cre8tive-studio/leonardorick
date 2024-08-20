import { request, gql } from 'graphql-request';
import type { GeneralsRequest } from '../../types/graphql-queries/generals-request';
import { getFormattedLocale } from '../utils/get-formatted-locale';

export default defineEventHandler(async (event) => {
  const { locale } = getQuery(event);
  const formatedLocale = getFormattedLocale(locale);
  const url = process.env.VUE_APP_PAYLOAD_GRAPHQL_URL as string;
  const query = gql`
    query ($locale: LocaleInputType!) {
      Generals(locale: $locale) {
        docs {
          id
          key
          data {
            text
            id
          }
        }
      }
    }
  `;

  // this map reduces a unecessary (for my usecase at least) list level present on payload
  return request<GeneralsRequest>(url, query, { locale: formatedLocale }).then((res) =>
    res.Generals.docs.map(({ data, ...doc }) => ({
      ...doc,
      data: data.map(({ text, ...item }) => ({
        ...item,
        text: text.map(({ children }) => children),
      })),
    }))
  );
});
