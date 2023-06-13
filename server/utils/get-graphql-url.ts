export function getGraphQlUrl(config: ReturnType<typeof useRuntimeConfig>) {
  const { VUE_APP_SANITY_GRAPHQL_URL } = config;
  const { VUE_APP_ENVIRONMENT } = config.public;
  return `${VUE_APP_SANITY_GRAPHQL_URL}/${VUE_APP_ENVIRONMENT}/default`;
}
