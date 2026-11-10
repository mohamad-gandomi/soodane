import { storage } from './storage';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers, ...rest } = options;

  let url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const qs = searchParams.toString();
    if (qs) {
      url += (url.includes('?') ? '&' : '?') + qs;
    }
  }

  const token = storage.getToken();
  const isFormData = typeof FormData !== 'undefined' && rest.body instanceof FormData;

  const mergedHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((headers as Record<string, string>) || {}),
  };
  if (isFormData && 'Content-Type' in mergedHeaders) {
    delete mergedHeaders['Content-Type'];
  }

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      ...rest,
      headers: mergedHeaders,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new Error(
        errorBody?.message || `API request failed with status ${response.status}`
      );
    }

    const json = await response.json();
    // The backend uses TransformInterceptor: { success: true, data: ... }
    return (json?.data !== undefined ? json.data : json) as T;
  } catch (error) {
    // Log in development for transparent debugging
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[apiClient] Request to ${url} failed:`, error);
    }
    throw error;
  }
}
