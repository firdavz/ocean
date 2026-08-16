# Agentic — Marketing Landing Page

A single-page marketing site for **"Agentic"** (a fictional AI-agent-platform
product). It's a Next.js App Router project: one long scrolling page
(`app/page.tsx`) built from a handful of custom animated sections, styled with
Tailwind CSS v4 and shadcn/ui.

There is **no backend, no database, and no real API calls** — the "join the
waitlist" form, the "live agents" counter, and the audit-trail log are all
client-side mock data / fake animations. Don't go looking for a server; there
isn't one beyond `next dev`/`next start`.

## Tech stack

| Layer | Tool |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, React 19) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com/) (Radix primitives) |
| Icons | lucide-react |
| 3D/shader | `@react-three/fiber` + `three` (used by one experimental component, see below) |
| Analytics | `@vercel/analytics` |
| Package manager | pnpm (see `pnpm-lock.yaml`) |

## Prerequisites

- Node.js 20+ (Node 24 was used to verify this project)
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

> npm/yarn will also work if you prefer, but stick to one package manager —
> mixing lockfiles causes dependency drift.

## Project structure

```
app/
  layout.tsx      # root layout: fonts, <head> metadata, Vercel Analytics
  page.tsx         # the entire landing page — every section lives here
  globals.css      # ← the ACTUAL stylesheet Tailwind uses (see gotcha below)

components/
  agent-interface.tsx       # mock "PR review" / agent activity UI (dev-experience section)
  devex-section.tsx         # "install the SDK" code-snippet walkthrough section
  glitch-background.tsx     # experimental WebGL glitch shader — NOT currently used anywhere (see gotcha below)
  intro-animation.tsx       # full-screen "AGENTIC" letter intro that plays on load
  live-agent-feed.tsx       # fake real-time feed of "agents working" + live counter
  mobile-nav.tsx            # sticky/responsive nav bar
  pixel-icon.tsx            # tiny canvas-drawn animated pixel-art icons per section
  reveal-text.tsx           # word-by-word scroll-reveal text animation helper
  stacking-agent-cards.tsx  # scroll-driven stacking card carousel ("agent types")
  theme-provider.tsx        # next-themes wrapper (currently unused by layout.tsx)
  ui/                        # shadcn/ui primitives (button, dialog, card, table, ...)
                              #   — generated files, prefer regenerating via shadcn CLI
                              #   over hand-editing when you need a new primitive

hooks/                       # use-mobile, use-toast — small reusable React hooks
lib/utils.ts                 # `cn()` helper (clsx + tailwind-merge), used everywhere for classNames
public/                      # static assets (icons, the two local images used on the page)
components.json              # shadcn/ui config (aliases, style: "new-york", baseColor: "neutral")
next.config.mjs              # TypeScript build errors are ignored, images are unoptimized (see gotchas)
```

### How `app/page.tsx` is put together

`page.tsx` is intentionally one big file with clearly marked sections
(look for the `{/* ── SECTION NAME ── */}` comment banners). Top to bottom:

1. **Intro animation** — full-screen letter reveal (`IntroAnimation`)
2. **Nav** — `MobileNav`
3. **Hero** — background video + headline + stat counters
4. **Platform bento grid** — feature cards
5. **Agent types** — `StackingAgentCards`
6. **How it works** — 4-step process cards
7. **Integrations** — SDK code snippet + "live API" card
8. **Security & observability** — compliance list + fake audit log
9. **Developer experience** — `DevExSection`
10. **Marquee** — scrolling capability tags (pure CSS animation)
11. **Live agents** — `LiveAgentFeed` + `LiveAgentCounter`
12. **Pricing** — 3-tier pricing cards
13. **CTA / email signup** — local `useState` only, no submission anywhere
14. **Footer**

A few small helpers are defined at the top of `page.tsx` itself rather than
in `components/`: `useInView` (IntersectionObserver hook), `Counter`
(animated number), `BentoCard` (the reusable glass/hover card wrapper), and
`Tag` (the small pill label). If you need one of these elsewhere, consider
extracting it to `components/` first rather than copy-pasting.

## Styling notes

- Tailwind v4 is configured "CSS-first" (no `tailwind.config.js`) — theme
  tokens, custom fonts (`--font-pixel`), and keyframes live directly in
  `app/globals.css`.
- `components.json` tells the shadcn CLI where things go. To add a new
  primitive: `pnpm dlx shadcn@latest add <component>` rather than writing
  `components/ui/*` by hand.
- Most components hand-roll inline styles (`style={{...}}`) for animation
  timing/easing (transform/opacity/blur transitions) rather than Tailwind
  classes — that's deliberate, since the values are computed from React
  state (scroll position, intersection ratio, elapsed time), not static.

## Gotchas for new contributors

- **Two `globals.css` files exist** — `app/globals.css` (214 lines, has the
  glitch keyframes and `--font-pixel`) is the one actually imported by
  `app/layout.tsx` and used by Tailwind. `styles/globals.css` (125 lines) is
  an older/stale copy. Edit `app/globals.css`; don't touch `styles/` without
  checking whether it's still referenced anywhere.
- **`glitch-background.tsx` is currently unused.** It's a fully working
  react-three-fiber WebGL shader component but nothing in `page.tsx` imports
  it. If you're asked to wire it in (or asked why the WebGL deps like
  `three`/`@react-three/fiber` are in `package.json` when the page looks
  static), that's why.
- **`next.config.mjs` sets `typescript.ignoreBuildErrors: true` and
  `images.unoptimized: true`.** Production builds will succeed even with
  TypeScript errors — don't rely on `pnpm build` to catch type errors, run
  `pnpm lint` / your editor's TS checking instead. Images skip Next's
  optimization pipeline (needed because most images are hot-linked from an
  external Vercel Blob storage URL, not `public/`).
- **Most imagery/video is hot-linked** to `https://hebbkx1anhila5yf.public.blob.vercel-storage.com/...`
  URLs rather than living in `public/images/`. Only `arc.png` and
  `footer.png` are local. If those external assets ever 404, that's an
  external storage issue, not a bug in this repo.
- **No tests exist yet.** There's no test runner configured. If you add
  one, Vitest + React Testing Library is the natural fit for this stack.
- **This is not a git repo yet** (no `.git` directory) — run `git init` if
  you're setting up version control for the first time.
- **`ThemeProvider` (`components/theme-provider.tsx`) is unused** — the page
  is hardcoded to a light theme (`bg-[#F5F4F0] text-[#111]`) even though
  `next-themes` is installed. Dark mode is not wired up.

## Suggested next reads

1. `app/page.tsx` top to bottom — it's the whole app.
2. `components/pixel-icon.tsx` — good example of the canvas/RAF animation
   pattern reused across this codebase.
3. `components/ui/button.tsx` — smallest example of the shadcn/CVA pattern
   used for every primitive in `components/ui/`.
