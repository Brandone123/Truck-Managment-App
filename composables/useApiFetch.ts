import type { UseFetchOptions } from 'nuxt/app'
import { useRequestHeaders } from "nuxt/app";

export function useApiFetch<T>(path: string, options: UseFetchOptions<T> = {}) {

  const config = useRuntimeConfig() 
  const baseUrl = config.public.baseUrl || "http://localhost:3000"
  const apiUrl = config.public.apiUrl || "http://localhost:8000"

  let headers: any = {
    accept: "application/json",
    referer: baseUrl,
    "Content-Type": "application/json"
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

  return useFetch(apiUrl + path, {
    credentials: "include",
    watch: false,
    ...options,
    headers: {
      ...headers,
      ...options?.headers
    }
  });
}