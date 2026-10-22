export function isPublicPage(pathname: string): boolean {
  return ['/auth', '/landing', '/blog', '/legal', '/support'].some(
    path => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export function safeReturnPath(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || /[\\\s]/.test(value)) return '/';
  try {
    const url = new URL(value, 'https://app.invalid');
    if (url.origin !== 'https://app.invalid' || url.pathname === '/auth' || url.pathname.startsWith('/auth/')) return '/';
    return url.pathname + url.search + url.hash;
  } catch { return '/'; }
}
