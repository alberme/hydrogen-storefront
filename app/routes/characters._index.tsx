import {useLoaderData} from '@remix-run/react';
import {CacheShort} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@netlify/remix-runtime';

export async function loader({context}: LoaderFunctionArgs) {
  const {characters} = await context.rickAndMorty.query(CHARACTERS_QUERY, {
    cache: CacheShort(),
  });
  return json({characters});
}

type Character = {
  name: string;
  id: string;
};

export default function Characters() {
  const {characters} = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Rick & Morty Characters</h1>
      <ul>
        {(characters.results || []).map((character: Character) => (
          <li key={character.name}>{character.name}</li>
        ))}
      </ul>
    </div>
  );
}

const CHARACTERS_QUERY = `#graphql:rickAndMorty
  query {
    characters(page: 1) {
      results {
        name
        id
      }
    }
  }
`;
