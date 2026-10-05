# Coffeeroasters

Marketing site and coffee-subscription plan builder, built with **Astro 7**, **TypeScript** (strict) and **SCSS**.

## Getting started

```bash
nvm use          # Node 24 (see .nvmrc)
npm install
npm run dev      # http://localhost:4321
```

| Script                            | What it does                                       |
| --------------------------------- | -------------------------------------------------- |
| `npm run dev`                     | Dev server with HMR                                |
| `npm run build`                   | Type-check (`astro check`) + static build → `dist` |
| `npm run preview`                 | Serve the production build                         |
| `npm run test`                    | Unit tests (Vitest)                                |
| `npm run lint` / `lint:fix`       | ESLint (TS + Astro)                                |
| `npm run format` / `format:check` | Prettier                                           |
| `npm run validate`                | Everything CI runs                                 |

## Architecture

```
src/
├── assets/            # Source images & SVG icons (optimised at build time)
├── components/
│   ├── ui/            # Primitives: Button, Logo, SocialLinks
│   ├── layout/        # SiteHeader (mobile menu), SiteFooter, NavLinks
│   └── sections/      # Page sections; shared ones (Hero, HowItWorks) at the root,
│       ├── home/      # page-specific ones in sub-folders
│       └── about/
├── features/
│   └── plan-builder/  # Self-contained feature
│       ├── model/     # Pure TS domain logic: steps, pricing, summary (unit-tested)
│       ├── ui/        # Astro components for the feature
│       ├── plan-builder.ts   # <plan-builder> custom element — DOM ↔ model glue
│       └── PlanBuilder.astro # Public entry point of the feature
├── data/              # Static content (nav, collection, benefits, headquarters…)
├── layouts/           # BaseLayout: <head>, fonts, header/footer, scroll reveal
├── lib/               # Framework-agnostic helpers (reveal, breakpoints, routes, images)
├── pages/             # File-based routes: /, /about, /create-plan, 404
└── styles/
    ├── abstracts/     # Sass-only: breakpoints & mixins (auto-injected, emit no CSS)
    ├── base/          # Tokens (CSS custom properties), reset, base, reveal
    └── global.scss
```

### Principles

- **Zero JS by default.** Pages are static HTML; only the mobile menu, scroll reveal and plan builder ship
  small scripts, each as a native custom element with listeners cleaned up via `AbortController`.
- **Business logic is pure and tested.** `features/plan-builder/model` knows nothing about the DOM.
  Prices are stored in cents to avoid floating-point errors. Untrusted form input is validated in
  `parseSelection`.
- **Content is data.** Copy for repeated items lives in `src/data` and is rendered with `.map()`.
- **Design tokens.** Colours, type scale, spacing and motion are CSS custom properties in
  `styles/base/_tokens.scss`. Breakpoints are mobile-first (`@include mq(md) { … }`) and mirrored in
  `lib/breakpoints.ts`.
- **Scoped styles.** Each component owns its styles in `<style lang="scss">`. The abstracts
  module is injected automatically, so mixins are always available.
- **Accessibility.** Semantic landmarks, skip link, native `<details>`, radio inputs and `<dialog>`,
  visible focus states and `prefers-reduced-motion` support.
- **Performance.** Images go through `astro:assets` (WebP, responsive `srcset`, art direction).
  Fonts are self-hosted with the Astro Fonts API, with preload and metric-matched fallbacks.

### Adding a page

1. Create `src/pages/<name>.astro` and wrap it in `<BaseLayout title="…">`.
2. Put sections that only this page uses in `src/components/sections/<name>/`.
3. Add the route to `ROUTES` / `NAV_LINKS` in `src/data/site.ts`.
