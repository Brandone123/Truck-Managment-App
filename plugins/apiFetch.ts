
import type { UseFetchOptions } from 'nuxt/app'
import { useRequestHeaders } from "nuxt/app";


export default defineNuxtPlugin((NuxtApp) => {

  const config = useRuntimeConfig()

  function useApiFetch<T>(path: string, options: UseFetchOptions<T> = {}) {

    let headers: any = {
      accept: "application/json",
      referer: config.public.baseURL,
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

    return useFetch(config.public.apiURL + path, {
      credentials: "include",
      watch: false,
      ...options,
      headers: {
        ...headers,
        ...options?.headers
      }
    });
  }

  return {
    provide: {
      useApiFetch: useApiFetch
    }
  }
})