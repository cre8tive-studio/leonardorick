import { request, gql } from 'graphql-request';
import { AllQuotesQuery } from '../../types/graphql-queries/all-quotes';
import { arrayObjToLangObj } from '../utils/array-obj-to-lang-obj';
import { getGraphQlUrl } from '../utils/get-graphql-url';

export default defineEventHandler(async (_event) => {
  const url = getGraphQlUrl();
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

  return request<AllQuotesQuery>(url, query).then((res) => arrayObjToLangObj(res.allQuote));
});
