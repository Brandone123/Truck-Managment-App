import { useRuntimeConfig, useCookie, useRequestHeaders } from 'nuxt/app';

const headers = (baseUrl: string) => {
  let headers: any = {
    accept: "application/json",
    referer: baseUrl,
  };

  const token = useCookie('XSRF-TOKEN');

  if (token.value) {
    headers['X-XSRF-TOKEN'] = token.value as string;
  }

  if (process.server) {
    headers = {
      ...headers,
      ...useRequestHeaders(["cookie"]),
    };
  }

  return headers;
};

export async function useApi<T>(path: string, options: RequestInit & { params?: Record<string, string> } = {}): Promise<any> {
  const config = useRuntimeConfig();
  const baseUrl = config.public.baseUrl || 'http://localhost:3000';
  const apiUrl = config.public.apiUrl || 'http://localhost:8000';

  // Handle query parameters
  let queryString = '';
  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      // Only stringify if the value is not already a string
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      searchParams.append(key, stringValue);
    });
    queryString = `?${searchParams.toString()}`;
  }

  const fullUrl = `${apiUrl}${path}${queryString}`;

  // Make a direct fetch request instead of useFetch
  const response = await fetch(fullUrl, {
    credentials: "include",
    ...options,
    headers: {
      ...headers(baseUrl),
      ...options.headers,
    },
  });

  // Check if the request was successful
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  return response
}
