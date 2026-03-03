# RUESAINTPHANTOM

Minimal image-first portfolio (Next.js 14 + Sanity + Tailwind + Framer Motion).  
Structure and UX inspired by haw-lin-services.com — no code copied.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **TailwindCSS**
- **Framer Motion**
- **Sanity CMS** (Studio embedded at `/studio`)

## Setup

```bash
pnpm i
cp .env.example .env
# Edit .env: set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET (create a project at sanity.io/manage)
pnpm dev
```

- Front: [http://localhost:3000](http://localhost:3000)
- Sanity Studio: run `pnpm studio` in another terminal for [http://localhost:3333](http://localhost:3333), or use the embedded Studio at [http://localhost:3000/studio](http://localhost:3000/studio) (see **Accès au Studio** below).

### Accès au Studio (CORS)

Sur sanity.io tu ne « crées » pas un Studio : tu as un **projet** (avec un Project ID). Le Studio est l’interface d’édition intégrée à ton site à `/studio` ; les contenus sont stockés dans ce projet Sanity.

Pour que la page **http://localhost:3000/studio** (ou **:3001** si le port change) fonctionne, il faut autoriser ton localhost dans Sanity :

1. Va sur [sanity.io/manage](https://www.sanity.io/manage) → choisis ton projet.
2. **Settings** (ou **Paramètres**) → **API** → **CORS origins**.
3. **Add CORS origin** :
   - Origin : `http://localhost:3000`
   - Coche **Allow credentials**.
4. Si tu utilises aussi le port 3001 : ajoute `http://localhost:3001` de la même façon.
5. Enregistre.

Après ça, recharge http://localhost:3000/studio (ou :3001/studio) : le Studio doit s’afficher et tu pourras te connecter avec ton compte Sanity.

## Build & deploy

```bash
pnpm build
pnpm start
```

**Deploy to Vercel (production MVP):** (1) Connect repo (Vercel → Add New → Project → Import Git). (2) Set env vars: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `NEXT_PUBLIC_SITE_URL` in Settings → Environment Variables; redeploy. (3) Deploy (Build: `pnpm build`). (4) Sanity CORS: sanity.io/manage → API → CORS — add `https://<your-vercel-domain>.vercel.app`, enable Allow credentials. (5) Custom domain: add in Vercel Domains and in Sanity CORS; set `NEXT_PUBLIC_SITE_URL`.
- **Sanity**: content is on Sanity’s CDN; ensure CORS allows your production domain and (if used) `localhost:3000` for Studio.

## Env vars

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset (e.g. `production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | API version (e.g. `2024-01-01`) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (sitemap, OG) |

**Quick QA before go-live:** Home = flat image grid (no project blocks); grid 1–2 cols mobile, 4–6 desktop; no horizontal overflow; `/project/[slug]` works direct + from home; closing project restores scroll; `pnpm build` passes; `/robots.txt` and `/sitemap.xml` work. See `docs/MVP_VERCEL_PATCH_PLAN.md` for full checklist.

## CMS (Sanity)

- **Site Settings** (singleton): site title, SEO, OG image, social links, contact, footer.
- **Info Page** (singleton): representation, address, contact, imprint, sections.
- **Projects**: title, slug, year, client, tags, description, cover, gallery (drag-and-drop reorder). Each gallery item: image (with hotspot/crop) or video URL + poster, caption, credit, alt.  
- **Ordering**: `indexOrder` for projects on the index; gallery order = array order in Sanity.
- **Published**: if `published` is false, the project is excluded from the index.

## Routes

- `/` — Index (image bank: all project images in one flat grid; hover = discrete overlay with title/year/client; click = project modal; back restores scroll)
- `/info` — Info page
- `/project/[slug]` — Project (full page on direct load or refresh; from index opens as modal, URL `/project/slug`, back restores scroll)
- `/studio` — Sanity Studio (embedded)

## Seed content (3 fake projects)

1. Open Studio (`pnpm studio` → http://localhost:3333, or http://localhost:3000/studio with env set).
2. In **Site Settings** and **Info Page**, fill in at least one field so the site has content.
3. Create 3 **Projects**: set title, slug (e.g. `project-one`), upload a **cover image** (required), optionally add gallery images (drag & drop, reorder). Set **Index Order** (0, 1, 2) or use the list’s drag handle to order. Keep **Published** checked.
4. Reorder projects in the list; order is reflected on the Index.

## Features

- **Home = image bank**: all images from all projects in one flat grid (order: project `indexOrder`, then cover + gallery order). No visual separation by project; hover shows discrete overlay (title, year, client); click opens project.
- Responsive grid: 2 cols mobile, 4–6 cols desktop, thin gap, full width, lazy load.
- Modal route: open project from index → URL `/project/slug`, close → back to index with scroll restored; refresh on `/project/slug` shows full project page.
- Project gallery: next/prev (UI + keyboard), preload next image, ESC and close button.
- `next/image` everywhere, correct `sizes`, Sanity LQIP blur placeholder.
- SEO: `generateMetadata` for index, info, project (with OG cover); sitemap; robots.txt.

## Sanity images (URL builder + LQIP)

- **URL builder**: `src/lib/image.ts` — `urlFor(source)` from `@sanity/image-url`; chain `.width()`, `.height()`, `.fit()`, `.quality()`, then `.url()`. Hotspot/crop from the image object are applied automatically.
- **LQIP**: Request `asset->metadata.lqip` in GROQ when you need a blur placeholder; pass to `next/image` as `blurDataURL` with `placeholder="blur"`. See `docs/SANITY_IMAGES.md` for details.
