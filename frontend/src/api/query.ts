import { getMode } from './env';

const getBaseUrl = (): string => {
  switch (getMode()) {
    case 'dev':
      return 'http://localhost:8000';
    case 'staging':
      return 'http://localhost/api';
    case 'prod':
      return '/api';
  }
};

export const query = async (query: string): Promise<string | null> => {
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
    return null;
  }
  try {
    const json = await response.json();
    return json?.response || null;
  } catch (error) {
    console.error('Error parsing json:', error);
    return null;
  }
};
