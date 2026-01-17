'use server';
// Here we will define afetcher function to interact with the all CoinGecko API endpoints

import qs from 'query-string';

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if (!BASE_URL) throw new Error('Could not get base url');
if (!API_KEY) throw new Error('Could not get api key');

// Define types for query parameters and error body
export async function fetcher<T>(
  endpoint: string,  // API endpoint
  params?: QueryParams,   // optional query parameters
  revalidate = 60, // revalidate every 60 seconds
): Promise<T> {
    // Construct the full URL with query parameters
  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}${endpoint}`,
      query: params, // Ex: { vs_currency: 'usd', ids: 'bitcoin'}
    },
    { skipEmptyString: true, skipNull: true }, 
  );

  // Make the fetch request to the CoinGecko API
  const response = await fetch(url, {
    // Set necessary headers for the request
    headers: {
      'x-cg-demo-api-key': API_KEY,
      'Content-Type': 'application/json',
    } as Record<string, string>,
    next: { revalidate },
  });

  if (!response.ok) {
    const errorBody: CoinGeckoErrorBody = await response.json().catch(() => ({}));

    throw new Error(`API Error: ${response.status}: ${errorBody.error || response.statusText} `);
  }

  return response.json();
}
