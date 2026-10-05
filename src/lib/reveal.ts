const REVEALED_CLASS = 'is-revealed';

/**
 * Reveals `[data-reveal]` elements once they scroll into view.
 * Optional `data-reveal-delay="300"` (ms) staggers the transition.
 */
export function initReveal(root: ParentNode = document): void {
  const elements = root.querySelectorAll<HTMLElement>('[data-reveal]');
  if (elements.length === 0) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add(REVEALED_CLASS));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add(REVEALED_CLASS);
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  );

  elements.forEach((el) => {
    const delay = el.dataset.revealDelay;
    if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`);
    observer.observe(el);
  });
}
