# Portfolio — Chekurthi Deepak

A static, frontend-only portfolio. One home page and a case study per project,
built to put measured results in front of the reader before the prose.

**Stack:** React 19 + TypeScript (strict) + Vite. No UI framework, no backend,
no analytics. Type is Fraunces for display, Manrope for text and
IBM Plex Mono for data, from Google Fonts.

**Design language:** warm near-black (or bone paper in light), a dot grid rather
than a gradient mesh, hairline rules rather than glass panels, and softly framed project cards, with exactly one
accent — vermillion — used flat. No gradient fills on text anywhere; the serif
italic carries the emphasis instead.

---

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run typecheck` | `tsc --noEmit` only |
| `npm run build` | Type-check, then build to `dist/` |
| `npm run preview` | Serve the production build locally |

`npm run build` is the real check: TypeScript runs in strict mode with
`noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess` and
`exactOptionalPropertyTypes`, so a type error fails the build rather than
reaching the site.

---

## Layout

```
src/
  content/            all copy and figures, as typed data
    profile.ts        name, email, links, hero metrics
    experience.ts     the UST HealthProof entry, and the skills groups
    projects/         one module per project + the display-order index
  components/         presentational only, no content
    Logo              a three-node dependency graph, not a monogram
    NodeField         the drifting node-graph canvas backdrop
    Header            section nav with scroll-spy, plus the mobile menu
    Reveal            scroll-triggered fade-and-lift
    CountUp           metric figures that count up in view
    Chart             horizontal bars for the real measured numbers
    ScrollProgress    accent bar tracking scroll position
    Marquee           seamless ticker of the stack
    MetricGrid        label, tabular figure, and the comparison
    DataTable         scrolls inside its own box, never widens the page
    Section           an h2 with an ordinal and a rule
    diagrams/         three hand-authored, theme-aware inline SVGs
  pages/
    Home.tsx
    CaseStudyShell    shared chrome for the three case studies
    case-studies/     one page per project
  styles/
    tokens.css        colour, type, space, motion — all as custom properties
    base.css          reset, base typography, grain overlay
    components.css    component styles and keyframes
```

**Content is separated from presentation on purpose.** Updating a number means
editing one object in `src/content/`, not hunting through JSX.

---

## Conventions worth keeping

- **Colour only ever comes from a token.** Light is the base definition on bare
  `:root`; dark is applied both under `prefers-color-scheme` (guarded so an
  explicit light choice still wins) and under `[data-theme="dark"]`. Never give
  a colour its only definition inside one of those blocks.
- **Animation must never gate content.** This is the rule the redesign turned
  on. `Reveal` renders visible content by default and adds a one-time entrance
  animation when its observer reports an intersection. If the observer is
  missing or never fires, the content stays readable. Mount
  animations are CSS with `animation-fill-mode: both`, so an interrupted
  animation still ends visible. `CountUp` renders the **real** figure by default
  and only starts from zero once a frame has actually been delivered, because a
  metric stuck at "0" is not a missing effect — it is a false claim.
- **Everything is disabled under `prefers-reduced-motion`,** via one global rule
  in `base.css` plus a visible-by-default override for `.reveal`.
- **One accent, used flat.** `--accent` marks section ordinals, the active nav
  underline, the primary button, list bullets, the highlighted table row and the
  emphasised chart bar. Do not add a second hue, and do not fill text with a
  gradient — the serif italic is what carries emphasis.
- **Charts show the real number.** A bar's width is its value; the grow-in is a
  CSS animation added on intersection with fill-mode `both`. If the class is
  never added the bar simply sits at its correct width.
- **Anything wide scrolls in its own container.** `.table-wrap` and
  `.figure__frame` are `overflow-x: auto`; the page body must never scroll
  sideways. Watch `white-space: nowrap` — a long section heading with it set was
  what broke this at 360px.
- **Every route has exactly one `h1`** and a title set through `useDocumentMeta`.
- **The nav links to sections, not projects.** `src/content/nav.ts` is the single
  list; it drives the desktop nav, the mobile panel and the scroll-spy, so adding
  a section means adding an entry there and an `id` on the `<Section>`.
- **Section jumps are positioned by `useScrollToTop`, not the browser.** In an
  SPA the target may not exist when the route commits, and the layout can move
  afterwards (the mobile panel closing removes its own height), so the position
  is re-applied on a short schedule with `scroll-behavior` forced to `auto` —
  otherwise the smooth-scroll animation and the corrective passes fight.
- **The backdrop is decorative and must stay that way.** `NodeField` is
  `aria-hidden`, takes no pointer events, stops while the tab is hidden, and
  paints a single static frame under `prefers-reduced-motion`. It reads its
  colours from the CSS custom properties so there is one source for the palette.
  The pointer is drawn as an extra node, which is what makes the field read as
  alive rather than as a still image — `SPEED` at 0.09 was slow enough to look
  static, so keep it around 0.4.
- **The résumé links download rather than open.** All five (nav, mobile panel,
  hero, contact, footer) carry `download`, which is why `vercel.json` only
  rewrites extensionless paths: under a catch-all rewrite a missing
  `/resume.pdf` would serve `index.html`, and the browser would save that HTML
  under a `.pdf` name instead of failing honestly.

---

## Deploying

Static output in `dist/`. `vercel.json` carries the SPA rewrite (every path
serves `index.html`) plus immutable caching for hashed assets.

```bash
npm run build
vercel deploy --prod
```

On any other host, the one requirement is the same SPA fallback — without it,
`/oncall-copilot` 404s on a hard refresh.

---

## Outstanding

- **The résumé PDF still quotes the old Multimodal RAG evaluation.** It says a
  38-question set and "75 percent to 81 percent"; the case study — and the
  project's own README — say 89 questions and a delivered rate of 0.69 to 0.87.
  Two different figures for the same project across the site and the CV.
- **Three media placeholders** render a labelled dashed box saying which asset
  belongs there: the OnCall demo GIF (`docs/demo.gif` in that repo), and
  screenshots for OnCall and Multimodal RAG. Replace with `<img>` inside the
  existing `<Figure>`.
- **The Multimodal RAG repo URL** is a profile link, not a direct repo link —
  see the TODO in `src/content/projects/multimodal-rag.ts`.
- **`github.com/deepak170601/OnCallCopilot` returns 404** to anonymous visitors,
  so the flagship case study's Source button is broken until that repo is public.
- **No deep links to sections.** Section `id`s and `scroll-margin-top` exist, but
  an SPA has no DOM at parse time, so a pasted `#section` URL lands at the top.
  Nothing in the UI links that way today.

## Typography and layout refinement

Fraunces supplies expressive titles and italic emphasis; Manrope handles body
copy, navigation, and tabular metric figures. IBM Plex Mono remains for technical
labels. Body copy starts at 16px, with 14px notes and 12px secondary metadata.

At desktop widths the hero pairs the name with the introduction in two columns.
Project cards use framed surfaces and a separate metrics inset; skills use two
columns, collapsing to one on mobile. Shared refinements are grouped at the end
of components.css. The existing palette tokens and reduced-motion behavior apply
to the new styles in both themes.

## Motion refinement

The name uses staggered word reveals, preserving Fraunces kerning, followed by
a short accent underline. Sections animate once when entering the viewport.
Buttons have lift and press feedback; project arrows, the theme icon, and the
header mark have small interaction accents. Hover motion is limited to fine
pointers. Reduced-motion preferences disable the name and section entrances,
button movement, and scroll-progress spring smoothing.

## Homepage composition

Layout rules live in `src/styles/layout.css`. The initial reading order is retained:
a single-column introduction, full-width project cards, then experience, skills,
and contact as separate sections. Buttons and tags flow horizontally, hero metrics
form three columns, and project descriptions sit beside two-column metric panels.
Skills use two columns. These groups stack progressively on smaller screens.
Existing typography, palette, surfaces, and all animations are preserved, including
the section-divider entrance.

## Intro illustration

`public/backend-systems-v2.png` is an original transparent image generated with the
built-in image-generation tool. The exact prompt is in `hero-illustration-v2-prompt.txt`.
It represents event-driven services, a database, and document retrieval in the
existing neutral and vermillion palette. It occupies the right of the desktop
introduction and stacks beneath the intro actions below 1000px. Intrinsic image
dimensions reserve space. Descriptive alt text and a short caption explain the
service clusters, recovery loop, incident correlation and cited retrieval.
The existing entrance animation and reduced-motion rules apply.