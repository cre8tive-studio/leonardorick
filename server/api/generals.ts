import { request, gql } from 'graphql-request';
import type { GeneralsResponse } from '../../types/graphql-queries/generals-response';
import { getFormattedLocale } from '../utils/get-formatted-locale';
import { parseGenerals } from '~/utils/parsers/generals.parser';

export default defineEventHandler(async (event) => {
  const { locale } = getQuery(event);
  const formatedLocale = getFormattedLocale(locale);
  const url = process.env.PAYLOAD_GRAPHQL_URL as string;
  const query = gql`
    query ($locale: LocaleInputType!) {
      Generals(locale: $locale) {
        docs {
          id
          key
          data {
            text
            id
            htmlTag
            animationType
          }
        }
      }
    }
  `;

  // this map reduces a unecessary (for my usecase at least) list level present on payload
  return request<GeneralsResponse>(url, query, { locale: formatedLocale }).then(parseGenerals);
});
