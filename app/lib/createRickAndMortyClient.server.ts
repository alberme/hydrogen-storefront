import {createWithCache, CacheLong, type WithCache} from '@shopify/hydrogen';

type AllCacheOptions = Parameters<WithCache>[1];

export function createRickAndMortyClient({
  cache,
  waitUntil,
}: {
  cache: Cache;
  waitUntil: ExecutionContext['waitUntil'];
}) {
  const withCache = createWithCache({cache, waitUntil});

  async function query<T = any>(
    query: `#graphql:rickAndMorty${string}`,
    options: {variables?: object; cache: AllCacheOptions} = {
      variables: {},
      cache: CacheLong(),
    },
  ) {
    return withCache(
      ['r&m', query, JSON.stringify(options.variables)],
      options.cache,
      async function () {
        const response = await fetch('https://rickandmortyapi.com/graphql', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables: options.variables,
          }),
        });

        if (!response.ok) {
          throw new Error('error fetching api');
        }

        const json = await response.json<{data: T; error: string}>();

        return json.data;
      },
    );
  }
  return {query};
}
