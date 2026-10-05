/** Mirrors `$breakpoints` in src/styles/abstracts/_breakpoints.scss. */
export const BREAKPOINTS = {
  sm: 576,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

export function breakpointQuery(name: Breakpoint): string {
  return `(min-width: ${BREAKPOINTS[name]}px)`;
}
