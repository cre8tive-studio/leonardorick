import { request, gql } from 'graphql-request';

import type { ExperiencesResponse } from '~/types/graphql-queries/experiences-response';
import { getFormattedLocale } from '../utils/get-formatted-locale';

export default defineEventHandler(async (event) => {
  const { locale } = getQuery(event);
  const formatedLocale = getFormattedLocale(locale);
  const url = process.env.VUE_APP_PAYLOAD_GRAPHQL_URL as string;
  const query = gql`
    query Experiences($locale: LocaleInputType!) {
      Experiences(locale: $locale) {
        docs {
          id
          company {
            id
            name
            country
            site
            image {
              cloudinary {
                secure_url
              }
            }
          }
          title
          funTitle
          year
          updatedAt
          createdAt
        }
      }
    }
  `;

  // this map reduces a unecessary (for my usecase at least) list level present on payload
  return request<ExperiencesResponse>(url, query, { locale: formatedLocale }).then((res) => res.Experiences.docs);
});
