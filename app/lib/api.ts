// app/lib/api.ts

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  'https://pixelpost-backend-clean.onrender.com';

type ApiOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
};

export async function apiRequest(
  path: string,
  options: ApiOptions = {}
) {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed (${res.status}): ${text}`);
  }

  return res.json();
}

