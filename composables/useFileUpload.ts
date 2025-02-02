import { useRuntimeConfig, useCookie, useRequestHeaders } from 'nuxt/app';

export async function useFileUpload(path: string, formData: FormData) {
  const config = useRuntimeConfig();
  const baseUrl = config.public.baseUrl || 'http://localhost:3000';
  const apiUrl = config.public.apiUrl || 'http://localhost:8000';

  let headers: any = {
    accept: 'application/json',
    referer: baseUrl,
    // 'Content-Type': 'multipart/form-data', // Do not set this header for FormData
  };

  const token = useCookie('XSRF-TOKEN');

  if (token.value) {
    headers['X-XSRF-TOKEN'] = token.value as string;
  }

  if (process.server) {
    headers = {
      ...headers,
      ...useRequestHeaders(['cookie']),
    };
  }

  try {
    const response = await fetch(apiUrl + path, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers,
    });

    const data = await response.json();

    console.log(response)
    if (!response.ok) {
      console.log('file upload throws error')
      throw new Error(data.message || 'Failed to upload file');
    }

    return data;
  } catch (error: any) {
    console.log('file upload caught error')
    // Ensure that the error is passed properly up the chain
    throw new Error(error.message || 'Unknown error occurred during file upload');
  }
}
