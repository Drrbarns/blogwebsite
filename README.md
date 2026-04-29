# About a Girl — Next.js 16 + Payload 3

A personal blog about the many sides of one woman — faith, sport,
medicine and the small things in between. Built on Next.js 16 (App
Router, Turbopack), React 19, Tailwind v4 and Payload CMS 3 — backed by
Supabase Postgres + Storage and deployable to Vercel.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js `16.2.4` (App Router + Turbopack) |
| UI runtime | React `19.2.4` |
| Styling | Tailwind v4, `@theme inline` tokens |
| Typography | `next/font` (Plus Jakarta Sans, DM Sans) |
| Motion | Framer Motion |
| Icons | Lucide + inline brand SVGs |
| CMS | Payload `3.84+` (embedded in Next.js) |
| Editor | Lexical with custom blocks (Callout, Code, Embed) |
| Database | Supabase Postgres via `@payloadcms/db-postgres` |
| Media | Supabase Storage via `@payloadcms/storage-s3` |
| Feeds | RSS 2.0, Atom, JSON Feed 1.1 |
| OG images | Per-post generated via `next/og` |
| Email | Resend (wired, used in Phase 3) |

## Quick start

1. **Create a Supabase project**
   - Copy the *direct* connection string (port `5432`) from
     Project Settings → Database → Connection Strings.
   - Create a public bucket named `media` (or edit `S3_BUCKET`).
   - Generate an S3-compatible access key from
     Project Settings → API → S3 Connection.
2. **Fill `.env.local`** (copy from `.env.local.example`):
   ```bash
   cp .env.local.example .env.local
   ```
   Paste your Supabase credentials, then set long random strings for
   `PAYLOAD_SECRET`, `REVALIDATE_SECRET`, `PREVIEW_SECRET`.
3. **Install & seed**:
   ```bash
   npm install
   npm run seed          # creates admin user, categories, tags, posts
   ```
4. **Start the dev server**:
   ```bash
   npm run dev
   ```
   - Public site: <http://localhost:3000>
   - Admin panel: <http://localhost:3000/admin>
     (log in with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`)

## Project map

```
app/
  (marketing)/      Public site shell (html/body, fonts, navbar, footer)
    page.tsx        Home — pulls from lib/cms.getHomepageData()
    blog/           Index + [slug] + generated opengraph-image
  (payload)/        Payload admin + REST + GraphQL mounts
  api/
    preview/        Enter draft-mode & redirect to slug
    exit-preview/   Leave draft-mode
    revalidate/     HMAC-signed on-demand revalidation
  sitemap.ts        Driven by CMS (posts + categories + tags)
  rss.xml/          RSS 2.0 feed
  feed.atom/        Atom feed
  feed.json/        JSON Feed 1.1
  robots.ts

collections/
  Users, Posts, Pages, Categories, Tags, Media
  access/roles.ts       RBAC helpers (admin/editor/author/contributor/subscriber)
  fields/seo.ts         Shared SEO field group (+ slug + readingTime)
  hooks/slug.ts         Auto-slugify + slug history (301s)
  hooks/readingTime.ts  Lexical word-count → minutes
  hooks/revalidate.ts   next/cache busting on writes

components/
  blog/lexical-renderer.tsx   Server-rendered Lexical → React
  ...                         All existing UI preserved

lib/
  cms/
    payload.ts     Local API singleton
    queries.ts     Typed query wrappers + unstable_cache tagging
    transforms.ts  Payload → BlogPost DTOs
    index.ts       Unified entry w/ graceful mock fallback
  seo/
    metadata.ts    generatePageMetadata + generateArticleMetadata
    json-ld.ts     Website/Org/Blog/Article/Breadcrumb schemas

scripts/
  seed.ts          Idempotent seeder (mock data → Payload)

payload.config.ts  Postgres adapter, S3 storage, plugins (SEO, redirects,
                   nested-docs, search)
```

## Available scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Next.js dev server (`--no-server-fast-refresh` required for Payload HMR) |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run seed` | Populate Payload with mock content (idempotent) |
| `npm run generate:types` | Regenerate `payload-types.ts` after collection edits |
| `npm run generate:importmap` | Regenerate admin import map after custom components |
| `npm run migrate` | Apply Payload migrations |
| `npm run migrate:create` | Create a new Payload migration from current schema |

## SEO foundation (Phase 1)

Every article page ships with:

- Dynamic `generateMetadata` (title, description, canonical, Open Graph
  article tags, Twitter large-card, robots).
- Three schema.org JSON-LDs: `Article`, `BreadcrumbList` and site-level
  `WebSite` / `Organization` / `Blog`.
- Per-post OG image generated at the edge from `next/og`.
- Auto reading-time calculation via the Lexical pre-save hook.
- Auto `slug-history` tracking — renames produce a 301 redirect at
  `/blog/[slug]` via the `getPostByHistoricalSlug` lookup.
- Sitemap index that includes posts, category and tag archive URLs.
- RSS, Atom and JSON feeds discoverable via `<link rel="alternate">`.

## God-tier SEO + CMS (Phase 2)

Layered on top of Phase 1:

- **Yoast-style SEO scoring engine** — `lib/seo/score.ts` runs on every
  save, pushing a 0-100 score + traffic-light checks into the Payload
  admin sidebar (`components/admin/seo-panel.tsx`).
- **SERP + Twitter-card preview** inside the admin — live refresh as you
  type.
- **Inline JSON-LD schema validator** (`lib/seo/schema-validate.ts`)
  surfaces missing required fields before publish.
- **Publish quality gate** — blocks publishing if score < 60, schema
  invalid or alt text missing (can be toggled in the `Site Settings`
  global, overridable per post).
- **Auto alt-text** — Media `beforeChange` hook + `/api/ai/alt` endpoint
  use Groq (Llama 4 Scout vision) to fill missing alt text.
- **Auto internal-link suggestions** — `/api/ai/internal-links` returns
  ranked related posts for the current draft, rendered in an admin side
  panel.
- **Broken-link checker cron** — `/api/cron/link-check` probes external
  URLs, writes results into the `link-health` collection.  Vercel cron
  is pre-wired in `vercel.json` (daily 03:00 UTC).
- **IndexNow** — on publish we ping Bing + Yandex; host your key at
  `/api/indexnow/[key]` or drop `{KEY}.txt` in `/public`.
- **Canonical proxy** (`proxy.ts`, Next.js 16+) — strips trailing
  slashes, lowercases blog URLs, enforces optional `CANONICAL_HOST`,
  applies `X-Robots-Tag: noindex` on `/admin`, `/api/*`, `/preview`.
- **404 logging** — `not-found-logs` collection + `/api/log/404`; editors
  can add the missing URL to Redirects in one click.
- **Navigation global** — header, footer and CTA are now managed in
  Payload (`Navigation` global).  `components/layout/site-header.tsx` +
  `site-footer.tsx` fetch it on the server.
- **Site Settings global** — brand info, default SEO, publish gate,
  analytics IDs, IndexNow key.
- **Page builder blocks** — `Pages` collection ships Hero, FeatureGrid,
  LogoCloud, Stats, Testimonials, FAQ, CTA, Split, Video, RichText and
  Newsletter blocks, rendered by `components/page-blocks/`.
- **Dynamic `/[slug]` route** — any CMS Page (privacy, terms, about…) is
  automatically served with proper metadata + ISR.
- **Archive pages** — `/blog/category/[slug]`, `/blog/tag/[slug]`,
  `/authors`, `/authors/[slug]` all ship with hero + filtered grid +
  pagination + correct JSON-LD (CollectionPage / Person / FAQPage).
- **Full-text search** — `/search` page + ⌘K typeahead dialog in the
  navbar (`components/search/search-dialog.tsx`) powered by the Payload
  search plugin.
- **Custom 404 + global-error** — suggests recent posts + sends the
  missed path to `/api/log/404`.
- **Dark mode** — `next-themes` toggle in the navbar, CSS variables in
  `globals.css`.
- **Article enhancements** — top reading-progress bar, scroll-spy TOC
  sidebar, share buttons (X, LinkedIn, Facebook, copy link).

### Cron jobs

`vercel.json` registers:

| Path | Schedule | Purpose |
|------|----------|---------|
| `/api/cron/link-check` | `0 3 * * *` | Probe outbound URLs → `link-health` |

Add `CRON_SECRET` to your env and call the endpoint with
`Authorization: Bearer $CRON_SECRET` for manual runs.

### Environment variables (extra)

| Var | Purpose |
|-----|---------|
| `GROQ_API_KEY` | Auto alt-text via Groq vision (free tier at console.groq.com) |
| `GROQ_VISION_MODEL` | Override the default `meta-llama/llama-4-scout-17b-16e-instruct` |
| `INDEXNOW_KEY` | Verification key hosted at `/api/indexnow/[key]` |
| `CANONICAL_HOST` | Force e.g. `www.aboutagirl.blog` → apex |
| `CRON_SECRET` | Bearer token for cron endpoints |

## Graceful fallback

`lib/cms/index.ts` wraps every query in a `safely()` helper.  While the DB
is empty (or `DATABASE_URI` is unset) the frontend transparently falls back
to `lib/data/*` mocks — so `npm run dev` always produces a fully rendered
site even before the first seed.

## Revalidation

- **Automatic** — every Payload `afterChange` hook calls `revalidateTag`
  (`{ expire: 0 }`) and the relevant `revalidatePath` entries.
- **Webhook** — `POST /api/revalidate` with `x-timestamp` and
  `x-signature: hmac-sha256(REVALIDATE_SECRET, timestamp + "." + rawBody)`
  accepts `{ path?, paths?, tag?, tags? }` JSON bodies.

## Preview mode

The Payload admin exposes a *Preview* button on every post; it hits
`/api/preview?secret=…&slug=…&collection=posts` which enables draft mode
and redirects to the article.  Exit preview via `/api/exit-preview`.

## Next phases (see plan)

- **Phase 3** — Comments, newsletter + broadcast composer, form builder,
  first-party analytics.
- **Phase 4** — AI writing assistant, multi-author workflow, scheduled
  publish cron, 2FA, localization, admin brand customization.
