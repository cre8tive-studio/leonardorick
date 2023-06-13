import { request, gql } from 'graphql-request';
import { AllRecommendationsQuery } from '../../types/graphql-queries/all-recommendations';
import { LANGUAGES, LanguageOptions } from '../../utils/constants/languages';
import { RecommendationModel } from '../../types/recommendation.model';

export default defineEventHandler(async (_event) => {
  // todo don't use runtimeConfig until cloudflare allows
  // const { VUE_APP_SANITY_GRAPHQL_URL: graphQL } = useRuntimeConfig();
  // https://github.com/unjs/nitro/issues/272
  // https://nitro.unjs.io/deploy/providers/cloudflare
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

  const res = await request<AllRecommendationsQuery>(graphQL, query);
  // basically converts:
  // [ { _id, author, text[en, pt]] } ] into
  // { en: [id, author, text], pt: [id, author, text] }
  return LANGUAGES.reduce((acc, lang) => {
    const langList = res.allRecommendation.reduce((list, query) => {
      list.push({
        id: query._id,
        value: query.text.find((text) => text._key === lang)?.value || '',
        author: query.author.name,
        lang,
      });

      return list;
    }, [] as RecommendationModel[]);
    acc[lang] = langList;
    return acc;
  }, {} as Record<LanguageOptions, RecommendationModel[]>);
});
