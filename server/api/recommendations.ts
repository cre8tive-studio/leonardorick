import { request, gql } from 'graphql-request';
import type { RecommendationsResponse } from '../../types/graphql-queries/recommendations-request';
import { getFormattedLocale } from '../utils/get-formatted-locale';

export default defineEventHandler(async (event) => {
  const { locale } = getQuery(event);
  const formatedLocale = getFormattedLocale(locale);
  const url = process.env.PAYLOAD_GRAPHQL_URL as string;
  const query = gql`
    query ($locale: LocaleInputType!) {
      Recommendations(locale: $locale) {
        docs {
          id
          recommendation
          order
          author {
            id
            name
            description
            linkedIn
            image {
              cloudinary {
                secure_url
              }
            }
          }
        }
      }
    }
  `;
  return request<RecommendationsResponse>(url, query, { locale: formatedLocale }).then(
    (res) => res.Recommendations.docs
  );
});
