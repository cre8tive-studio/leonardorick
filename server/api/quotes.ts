import { request, gql } from 'graphql-request';
import { AllQuotesQuery } from '../../types/graphql-queries/all-quotes';
import { arrayObjToLangObj } from '../utils/array-obj-to-lang-obj';

export default defineEventHandler(async (_event) => {
  const { VUE_APP_SANITY_GRAPHQL_URL: graphQL = '' } = process.env;
  const query = gql`
    query {
      allQuote {
        _id
        authorName
        text {
          value
          _key
        }
      }
    }
  `;

  return request<AllQuotesQuery>(graphQL, query).then((res) => arrayObjToLangObj(res.allQuote));
});
