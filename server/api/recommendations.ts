import { request, gql } from 'graphql-request';
import type { RecommendationsRequest } from '../../types/graphql-queries/recommendations-request';

export default defineEventHandler(async (event) => {
  const { locale } = getQuery(event);
  const formatedLocale = locale?.toString().replace('-', '_') || null;
  const url = process.env.VUE_APP_PAYLOAD_GRAPHQL_URL as string;
  const query = gql`
    query ($locale: LocaleInputType = en) {
      Recommendations(locale: $locale) {
        docs {
          id
          recommendation
          author {
            name
            description
          }
        }
      }
    }
  `;
  return request<RecommendationsRequest>(url, query, { locale: formatedLocale }).then(
    (res) => res.Recommendations.docs
  );
});
