import { request, gql } from 'graphql-request';
import { H3Event } from 'h3';
import { AllQuotesQuery } from '../../types/graphql-queries/all-quotes';
import { LANGUAGES } from '../../utils/constants/languages';

export default defineEventHandler(async (event) => {
  // todo don't use runtimeConfig until cloudflare allows
  // const { VUE_APP_SANITY_GRAPHQL_URL: graphQL } = useRuntimeConfig();
  // https://github.com/unjs/nitro/issues/272
  // https://nitro.unjs.io/deploy/providers/cloudflare
  const { VUE_APP_SANITY_GRAPHQL_URL: graphQL = '' } = process.env;

  const lang = getLanguage(event);
  const query = gql`
    query {
      allQuote {
        _id
        text {
          value
          _key
        }
      }
    }
  `;

  const res = await request<AllQuotesQuery>(graphQL, query);
  const quotes = res.allQuote.map((quote) => ({
    id: quote._id,
    value: quote.text.filter((text) => text._key === lang)[0].value,
  }));
  return {
    data: quotes,
  };
});

function getLanguage(event: H3Event): string {
  const { lang } = getQuery(event) as { lang: string };
  return LANGUAGES.has(lang) ? lang : 'en';
}
