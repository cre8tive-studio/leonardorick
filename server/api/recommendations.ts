import { request, gql } from 'graphql-request';
import { AllRecommendationsQuery } from '../../types/graphql-queries/all-recommendations';
export default defineEventHandler(async (_event) => {
  // todo don't use runtimeConfig until cloudflare allows
  // const { VUE_APP_SANITY_GRAPHQL_URL: graphQL } = useRuntimeConfig();
  const { VUE_APP_SANITY_GRAPHQL_URL: graphQL = '' } = process.env;

  const query = gql`
    query {
      allRecommendation {
        _id
        author {
          name
        }
        text {
          value
          _key
        }
      }
    }
  `;

  return request<AllRecommendationsQuery>(graphQL, query).then((res) =>
    arrayObjToLangObj(res.allRecommendation)
  );
});
