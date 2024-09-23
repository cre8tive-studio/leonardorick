import { request, gql } from 'graphql-request';
import { getFormattedLocale } from '../utils/get-formatted-locale';
import { PersonalInfoResponse } from '../../types/graphql-queries/personal-info-response';

export default defineEventHandler(async (event) => {
  const { locale } = getQuery(event);
  const formatedLocale = getFormattedLocale(locale);

  const url = process.env.PAYLOAD_GRAPHQL_URL as string;
  const query = gql`
    query PersonalInfo {
      PersonalInfo {
        name
        email
        startWorkingDate
        links {
          linkedin
          github
          stackoverflow
          spotify
        }
      }
    }
  `;
  return request<PersonalInfoResponse>(url, query, { locale: formatedLocale }).then((res) => res.PersonalInfo);
});
