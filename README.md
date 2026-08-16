# Ocean — Suzish havzasi va Sauna

A single-page marketing site for **Ocean**, a swimming pool + sauna complex
in Chortoq, Namangan (Uzbekistan). It's a Next.js App Router project: one
long scrolling page (`app/page.tsx`) built from a handful of custom animated
sections, styled with Tailwind CSS v4 and shadcn/ui. Copy is in Uzbek.

There is **no backend, no database, and no real API calls** — everything on
the page (pricing cards, facility-info tabs, the intro animation) is static
content. The "contact" section links out to a real phone number and
Instagram account rather than submitting a form. Don't go looking for a
server; there isn't one beyond `next dev`/`next start`.

## Tech stack

| Layer | Tool |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, React 19) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com/) (Radix primitives) |
| Icons | lucide-react |
| Analytics | `@vercel/analytics` |
| Package manager | pnpm (see `pnpm-lock.yaml`) |

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/installation) — `npm install -g pnpm` if you don't have it

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. The dev server hot-reloads on save.

Other scripts (from `package.json`):

```bash
pnpm build   # production build
pnpm start   # run the production build (run `pnpm build` first)
pnpm lint    # eslint
```

> Stick to pnpm — a stray `npm install` will regenerate `package-lock.json`
> and drift out of sync with `pnpm-lock.yaml`.

## Project structure

```
app/
  layout.tsx      # root layout: fonts, <head> metadata, Vercel Analytics
  page.tsx         # the entire landing page — every section lives here
  globals.css      # Tailwind v4 "CSS-first" theme tokens + custom keyframes

components/
  intro-animation.tsx      # full-screen "OCEAN" letter intro that plays on load
  mobile-nav.tsx            # sticky/responsive nav bar
  reveal-text.tsx           # word-by-word scroll-reveal text animation helper
  stacking-price-cards.tsx  # scroll-driven stacking card carousel (pricing tiers)
  info-section.tsx          # tabbed facility-info panel (about / water quality / safety)
  ui/                        # shadcn/ui primitives (button, dialog, card, table, ...)
                              #   — generated files, prefer regenerating via shadcn CLI
                              #   over hand-editing when you need a new primitive

hooks/                       # use-mobile, use-toast — small reusable React hooks
lib/utils.ts                 # `cn()` helper (clsx + tailwind-merge), used everywhere for classNames
public/                      # hero/section videos, icons, and local photos
components.json              # shadcn/ui config (aliases, style: "new-york", baseColor: "neutral")
next.config.mjs              # TypeScript build errors are ignored, images are unoptimized (see gotchas)
```

### How `app/page.tsx` is put together

`page.tsx` is intentionally one big file with clearly marked sections
(look for the `{/* ── SECTION NAME ── */}` comment banners). Top to bottom:

1. **Intro animation** — full-screen "OCEAN" letter reveal (`IntroAnimation`)
2. **Nav** — `MobileNav`
3. **Hero** — background video (seasonal: pool video in summer, sauna video
   in winter) + headline + location kicker
4. **Suzish havzasi** — pool section: editorial copy + cinematic video + stats
5. **Sauna** — mirrored layout of the pool section, sauna video + stats
6. **Narxlar (pricing)** — `StackingPriceCards`, 4 scroll-stacking price cards
   (kids/adults pool day passes + monthly, 4-/6-person sauna rooms)
7. **Ma'lumot (facility info)** — `InfoSection`, a 3-tab panel (about /
   water quality / safety rules)
8. **Nega Ocean (why us)** — 3 feature cards (national food, live football,
   live music)
9. **Bog'lanish (book/contact)** — phone + Instagram cards, no form submission
10. **Footer**

The page also swaps copy and the hero video by season: `isWinter` is
computed from the current month and flips the hero quote, the "book now"
heading, and `heroVideoSrc` between summer (pool) and winter (sauna) framing.

A few small helpers are defined at the top of `page.tsx` itself rather than
in `components/`: `useInView` (IntersectionObserver hook), `Counter`
(animated number, currently unused but kept for future stat counters), and
`Tag` (the small pill label). If you need one of these elsewhere, consider
extracting it to `components/` first rather than copy-pasting.

## Styling notes

- Tailwind v4 is configured "CSS-first" (no `tailwind.config.js`) — theme
  tokens and keyframes live directly in `app/globals.css`. `--font-pixel`
  (mapped to Courier Prime) is used for small tracked-out uppercase labels
  throughout the page.
- `components.json` tells the shadcn CLI where things go. To add a new
  primitive: `pnpm dlx shadcn@latest add <component>` rather than writing
  `components/ui/*` by hand.
- Most components hand-roll inline styles (`style={{...}}`) for animation
  timing/easing (transform/opacity/blur transitions) rather than Tailwind
  classes — that's deliberate, since the values are computed from React
  state (scroll position, intersection ratio, elapsed time), not static.

## Gotchas for new contributors

- **`next.config.mjs` sets `typescript.ignoreBuildErrors: true` and
  `images.unoptimized: true`.** Production builds will succeed even with
  TypeScript errors — don't rely on `pnpm build` to catch type errors, run
  `npx tsc --noEmit` / your editor's TS checking instead.
- **Most media is local**, served straight from `public/` (`hero.mp4`,
  `sauna.mp4`, `ocean_3page.mp4`, and everything under `public/images/`).
  There are no hot-linked external asset URLs.
- **`components/ui/` is a shadcn/ui scaffold** — not every generated
  primitive is wired into the page (e.g. `sonner`/`toaster` aren't mounted
  in `layout.tsx`). That's expected; add the `<Toaster />` when you actually
  need toasts rather than assuming it's already live.
- **No tests exist yet.** There's no test runner configured. If you add
  one, Vitest + React Testing Library is the natural fit for this stack.

## Suggested next reads

1. `app/page.tsx` top to bottom — it's the whole app.
2. `components/stacking-price-cards.tsx` — the scroll-driven stacking-card
   pattern used for pricing.
3. `components/ui/button.tsx` — smallest example of the shadcn/CVA pattern
   used for every primitive in `components/ui/`.
