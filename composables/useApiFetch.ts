import type { UseFetchOptions } from 'nuxt/app'
import { useRequestHeaders } from "nuxt/app";
import { useClearData } from '@/composables/useClearData';


const headers = (baseUrl: string) => {

  let headers: any = {
    accept: "application/json",
    referer: baseUrl,
    // "Content-Type": "application/json"
  }

  const token = useCookie('XSRF-TOKEN');

  if (token.value) {
    headers['X-XSRF-TOKEN'] = token.value as string;
  }

  if (process.server) {
    headers = {
      ...headers,
      ...useRequestHeaders(["cookie"]),
    }
  }
  return headers
}

export function useApiFetch<T>(path: string, options: UseFetchOptions<T> = {}, maxRetries: number = 0) {

  const config = useRuntimeConfig()
  const baseUrl = config.public.baseUrl || "http://localhost:3000"
  const apiUrl = config.public.apiUrl || "http://localhost:8000"

  const { clearAllData } = useClearData(); // Import the clearAllData function from useClearData composable

  const fetchWithRetry = async (retryCount: number): Promise<any> => {
    try {

      // Handle query parameters
      let queryString = '';
      if (options.params && Array.isArray(options.params)) {
        const searchParams = new URLSearchParams();
        // Loop over array of key-value pairs
        options.params.forEach((param: { key: string, value: string }) => {
          searchParams.append(param.key, param.value);
        });

        queryString = `?${searchParams.toString()}`;
      }

      const fullUrl = `${apiUrl}${path}${queryString}`;


      const response = await useFetch(fullUrl, {
        credentials: "include",
        watch: false,
        ...options,
        headers: {
          ...headers(baseUrl),
          ...options?.headers,
        },
        signal: options.signal, // Pass the signal to the fetch request for cancellation

        // onResponse: ({ response }) => {
        //   // Intercept the response here if needed
        // },

        onResponseError: async ({ response }) => {
          // Intercept the response error
          if (response.status === 419) { // Check if the response status is 419 (CSRF mismatch)
            if (retryCount > 0) {
              clearAllData(); // Clear cookies, localStorage, and sessionStorage
              return fetchWithRetry(retryCount - 1);
            }
          }
        },

      });
      return response;
    } catch (error: any) {
      throw error; // Handle any other errors
    }
  };

  return fetchWithRetry(maxRetries);
}