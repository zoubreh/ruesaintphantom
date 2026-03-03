# MVP Vercel — Integrated Patch Plan

## A) Integrated patch plan (files to change)

| File | Change |
|------|--------|
| `src/components/ImageBankGrid.tsx` | Real CSS Grid: 1 col (xs), 2 sm, 3 md, 4 lg, 5 xl, 6 2xl. Remove duplicate scroll-restore logic (keep in layout). Container: `w-full max-w-full min-w-0` to prevent horizontal overflow. |
| `src/components/ImageBankCell.tsx` | Add `min-w-0` to cell wrapper so grid items don’t overflow. Adjust `sizes` for 1-column mobile: e.g. `(max-width: 640px) 100vw, (max-width: 768px) 50vw, …`. |
| `src/app/(site)/layout.tsx` | Keep `overflow-x-hidden` and `w-full` on main. ScrollRestoration stays. |
| `src/app/globals.css` | Optional: ensure `html, body { overflow-x: hidden }` if not already. |
| `src/lib/data.ts` | No change — already uses `homeGridQuery` and flattens all published projects’ cover + gallery. |
| `src/lib/queries.ts` | No change — `homeGridQuery` returns per-project items (cover + gallery); flatten in data.ts. |
| `src/app/(site)/page.tsx` | No change — no project title blocks; only `ImageBankGrid` with flattened items. |
| `src/app/robots.ts` | Safe fallback for `NEXT_PUBLIC_SITE_URL` (already present). |
| `src/app/sitemap.ts` | Uses `getIndexProjects()`; safeFetch in data returns [] if Sanity fails — no crash. |
| `README.md` | Add **Deploy to Vercel** section: GitHub → Vercel, env vars, Sanity CORS, credentials. |
| `.env.example` | Already lists all four production env vars. |

---

## B) Code changes (grid + flatten + routing)

- **Flatten**: Already correct — `getFlattenedGridItems()` uses `homeGridQuery` (published projects, ordered by indexOrder; each project: cover + gallery in order), then `flatMap` to one array. No project title blocks on home.
- **Grid**: See full file contents below for `ImageBankGrid` and `ImageBankCell`.
- **Routing**: No change — `/project/[slug]` full page; `@modal/(.)project/[slug]` for modal from home; scroll save in cell onClick, restore in `ScrollRestoration`.

---

## C) Deploy to Vercel — step-by-step checklist

1. **Connect repo**
   - Vercel Dashboard → Add New Project → Import Git Repository.
   - Select the repo (e.g. GitHub `ruesaintphantom`). Use default framework (Next.js).

2. **Environment variables**
   - Project Settings → Environment Variables. Add (Production + Preview if needed):
     - `NEXT_PUBLIC_SANITY_PROJECT_ID` = your Sanity project ID  
     - `NEXT_PUBLIC_SANITY_DATASET` = `production` (or your dataset)  
     - `NEXT_PUBLIC_SANITY_API_VERSION` = `2024-01-01`  
     - `NEXT_PUBLIC_SITE_URL` = `https://<your-vercel-domain>.vercel.app` (or custom domain)

3. **Deploy**
   - Deploy. Build command: `pnpm build` (or leave default). Output: Next.js.

4. **Sanity CORS**
   - sanity.io/manage → your project → Settings → API → CORS origins.
   - Add: `https://<your-vercel-domain>.vercel.app` (and custom domain if used).
   - Enable **Allow credentials** for Studio (embedded at `/studio`).
   - Optional: keep `http://localhost:3000` for local dev.

5. **Custom domain (optional)**
   - Vercel: Project → Settings → Domains → add domain.
   - Add same domain to Sanity CORS with **Allow credentials**.

---

## D) QA checklist (scroll restore, mobile grid, build)

Run through this before considering the MVP shipped:

- [ ] **Home is image bank** — Single flat grid of all images from all published projects; no project title blocks or sections.
- [ ] **Grid is responsive** — Very small: 1 column; mobile (sm): 2; tablet (md): 3; desktop (lg–2xl): 4–6. No horizontal scroll.
- [ ] **Mobile** — Dense, clean; 1–2 columns; no horizontal overflow.
- [ ] **/project/[slug]** — Works on direct load (full page) and from home (modal when implemented).
- [ ] **Close project** — Back to home with scroll position restored.
- [ ] **next/image** — Used for all images; correct `sizes`; Sanity LQIP placeholders where applicable.
- [ ] **Build** — `pnpm build` completes with no errors; no runtime errors on `pnpm start`.
- [ ] **SEO** — `/robots.txt` and `/sitemap.xml` resolve; metadata (index, info, project) does not crash.
