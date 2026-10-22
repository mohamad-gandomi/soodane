export const SESSION_COOKIE = 'sodaneh_session';

// Server-side traffic goes directly to the shared core, without a CDN round trip.
export async function validateSession(token: string): Promise<boolean> {
  if (!token || token.length > 3800 || /\s/.test(token)) return false;
  try {
    const base = process.env.CORE_API_INTERNAL_URL || 'http://127.0.0.1:4000/api/v1';
    const response = await fetch(`${base.replace(/\/$/, '')}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return false;
    const body = await response.json();
    return Boolean((body.data ?? body)?.id);
  } catch { return false; }
}
