import { request, gql } from 'graphql-request';
import { AllRecommendationsQuery } from '../../types/graphql-queries/all-recommendations';
import { getGraphQlUrl } from '../utils/get-graphql-url';
export default defineEventHandler(async (_event) => {
  const url = getGraphQlUrl(useRuntimeConfig());

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

  return request<AllRecommendationsQuery>(url, query).then((res) =>
    arrayObjToLangObj(res.allRecommendation)
  );
});
