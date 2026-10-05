/** Normalises a pathname so `/about`, `/about/` and `/about.html` compare equal. */
export function normalizePath(pathname: string): string {
  const trimmed = pathname.replace(/\.html$/, '').replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

export function isCurrentPath(href: string, pathname: string): boolean {
  return normalizePath(href) === normalizePath(pathname);
}
