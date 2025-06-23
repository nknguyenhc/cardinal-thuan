import { getMode } from './env';

const getBaseUrl = (): string => {
  switch (getMode()) {
    case 'dev':
      return 'http://localhost:8000/';
    case 'staging':
      return 'http://localhost:8000/';
    case 'prod':
      return 'https://cardinal-thuan-backend.nknguyenhc.net/';
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

export async function getTitle(query: string): Promise<string> {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}title`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  if (!response.ok) {
    console.error('Error getting title:', response.statusText);
    return '';
  }
  const data = await response.json();
  return data.title || '';
}
