const DEV_API_BASE_URL = 'http://localhost:3000';

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

/**
 * Resolve backend base URL for all frontend API calls.
 *
 * - Development/test: fallback to localhost for local DX.
 * - Production: require explicit VITE_API_BASE_URL to avoid silent misrouting.
 */
export function getApiBaseUrl(): string {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

  if (configuredBaseUrl) {
    return normalizeBaseUrl(configuredBaseUrl);
  }

  const isLocalLikeMode = import.meta.env.DEV || import.meta.env.MODE === 'test';
  if (isLocalLikeMode) {
    return DEV_API_BASE_URL;
  }

  throw new Error(
    'VITE_API_BASE_URL is not configured for production. Set it in your Vercel project environment variables.',
  );
}

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}
