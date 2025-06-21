import { getMode } from './env';

const getBaseUrl = (): string => {
  switch (getMode()) {
    case 'dev':
      return 'http://localhost:8000';
    case 'staging':
      return 'http://localhost/api/';
    case 'prod':
      return '/api/';
  }
};

export async function* query(
  query: string
): AsyncGenerator<string, void, unknown> {
  const baseUrl = getBaseUrl();
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  if (!response.ok) {
    console.error('Error querying:', response.statusText);
    return;
  }
  const reader = response.body?.getReader();
  if (!reader) {
    console.error('No reader available for response body');
    return;
  }
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    const textChunk = new TextDecoder().decode(value);
    yield textChunk;
  }
}
