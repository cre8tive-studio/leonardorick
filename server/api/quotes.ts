import { request, gql } from 'graphql-request';
import { getFormattedLocale } from '../utils/get-formatted-locale';
import type { QuotesResponse } from '../../types/graphql-queries/quotes-response';

export default defineEventHandler(async (event) => {
  const { locale } = getQuery(event);
  const formatedLocale = getFormattedLocale(locale);

  const url = process.env.PAYLOAD_GRAPHQL_URL as string;
  const query = gql`
    query ($locale: LocaleInputType!) {
      Quotes(locale: $locale, limit: 100) {
        docs {
          id
          quote
          author
          label
        }
        limit
      }
    }
  `;
  return request<QuotesResponse>(url, query, { locale: formatedLocale }).then((res) => res.Quotes.docs);
});
