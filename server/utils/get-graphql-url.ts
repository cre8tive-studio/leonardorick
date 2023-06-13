export function getGraphQlUrl() {
  const { VUE_APP_SANITY_GRAPHQL_URL } = process.env;
  const { environment } = useRuntimeConfig().public;
  return `${VUE_APP_SANITY_GRAPHQL_URL}/${environment}/default`;
}
