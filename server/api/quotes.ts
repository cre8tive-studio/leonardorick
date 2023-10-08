import { request, gql } from 'graphql-request';
import { getFormattedLocale } from '../utils/get-formatted-locale';
import type { QuotesRequest } from '../../types/graphql-queries/quotes-request';

export default defineEventHandler(async (event) => {
  const { locale } = getQuery(event);
  const formatedLocale = getFormattedLocale(locale);

  const url = process.env.VUE_APP_PAYLOAD_GRAPHQL_URL as string;
  const query = gql`
    query ($locale: LocaleInputType!) {
      Quotes(locale: $locale) {
        docs {
          id
          quote
          author
        }
      }
    }
  `;

  return request<QuotesRequest>(url, query, { locale: formatedLocale }).then(
    (res) => res.Quotes.docs
  );
});
