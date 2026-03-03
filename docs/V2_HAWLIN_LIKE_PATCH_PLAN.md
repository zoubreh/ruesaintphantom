# V2 Hawlin-like Image Bank — Unified Patch Plan

**MANAGER_RSP** — Orchestrator deliverable: spec, CMS, FE guidance, QA checklist, and unified patch plan.

---

## 1) DA_Spec_Hawlin — Strict UX spec + tokens + DO NOT list

### UX spec (strict)

| Area | Requirement |
|------|-------------|
| **Home** | Single flattened continuous grid of all images across all projects. No section headers, no project title blocks, no grouping by project. |
| **Grid** | Responsive: 2 cols mobile, 4–6 cols desktop; thin gap; full width; lazy load with intersection sentinel. |
| **Hover overlay** | **Desktop only.** On hover: discrete overlay (title, year, client). No overlay on touch (no hover state). |
| **Click** | Opens `/project/[slug]` as **modal route** when navigated from home. URL becomes `/project/[slug]`. |
| **Back** | Closing modal (back or close) returns to index and **restores previous scroll position**. |
| **Direct load** | Visiting or refreshing `/project/[slug]` shows **full page** project view (no modal). |
| **Project gallery** | Next/prev (UI + keyboard), ESC and close button, preload next image. |
| **Images** | `next/image` everywhere; correct `sizes`; Sanity LQIP blur placeholder. Hotspot/crop from Sanity respected. |

### Design tokens (align with existing)

- **Surface**: `#0a0a0a` (--surface)
- **Overlay**: `bg-surface/70`, discrete, bottom-aligned text
- **Typography**: uppercase, tracking-wide, small (10px–12px), neutral-300 / neutral-500
- **Gap**: `gap-1 md:gap-1.5`
- **Aspect**: grid cells `aspect-[3/4]`

### DO NOT list

- Do **not** copy code or assets from haw-lin-services.com or any reference site.
- Do **not** add project title blocks or section dividers on the home grid.
- Do **not** show hover overlay on touch devices (avoid sticky overlay on tap).
- Do **not** use modal for direct/refresh load of `/project/[slug]` (full page only).
- Do **not** add scope beyond MVP: no filters, no search, no lightbox on index, no video playback in grid (poster only).
- Do **not** break existing: info page, studio, SEO, sitemap, robots.

---

## 2) CMS_Sanity_Data — Schemas + GROQ for flatten + project view

### Schemas (current, verify only)

- **Project**: `title`, `slug`, `year`, `client`, `roles`, `tags`, `description`, `coverImage` (image, hotspot), `gallery` (array of `mediaItem`), `indexOrder`, `published`, `featured`.
- **mediaItem**: `type` (image | video), `image` (image, hotspot), `videoUrl`, `poster` (image, hotspot), `caption`, `credit`, `alt`, `aspectHint`.
- **Ordering**: Project list ordered by `indexOrder asc`. Gallery order = array order in Sanity (drag-and-drop in Studio).
- **Published filter**: Index grid uses only projects where `published == true`. Direct `/project/[slug]` can show project by slug (optionally also filter by `published` for consistency; recommend: direct URL shows if exists, 404 otherwise).

### GROQ for index (flattening)

Flattening is done in **application code** (`getFlattenedGridItems` in `src/lib/data.ts`), not in GROQ. GROQ returns projects only:

```groq
*[_type == "project" && published == true] | order(indexOrder asc) {
  _id, _type, title, "slug": slug.current, year, client, roles, tags, description,
  coverImage, gallery, indexOrder, published, featured
}
```

- **Flattening logic** (keep in `data.ts`): For each project, append cover image then each gallery item (image or video poster); order = project `indexOrder`, then cover, then gallery array order. Skip items without `asset._ref`.

### GROQ for project view

```groq
*[_type == "project" && slug.current == $slug][0] {
  _id, _type, title, "slug": slug.current, year, client, roles, tags, description,
  coverImage, gallery, indexOrder, published, featured
}
```

- No `published` filter so direct URL can show the project (or add `&& published == true` to 404 unpublished).

### Sanity Studio

- **Drag-and-drop**: Gallery uses array of `mediaItem`; Studio supports reorder.
- **Hotspot/crop**: `coverImage` and `mediaItem.image` / `mediaItem.poster` use `options: { hotspot: true }` (already in schemas).
- **Project ordering**: `indexOrder` + list order in Studio; index query orders by `indexOrder asc`.

---

## 3) FE_Grid_Modal — Implementation using specs and queries

### 3.1 Home page

- **File**: `src/app/(site)/page.tsx`  
  Keep: server component, `getFlattenedGridItems()`, `<ImageBankGrid items={items} />`. No project blocks.

### 3.2 Image bank grid

- **File**: `src/components/ImageBankGrid.tsx`  
  Keep: flattened list, intersection observer, 2/4–6 cols, sentinel. Optional: pass a ref or callback so a parent can save/restore scroll (see 3.5).

### 3.3 Image bank cell

- **File**: `src/components/ImageBankCell.tsx`  
  - **Hover overlay desktop only**: Render overlay only when `(hover && isDesktop)`. Use `window.matchMedia('(pointer: fine)')` or a small hook so overlay is hidden on touch devices.
  - Keep: `Link` to `/project/[slug]`, `scroll={false}`, `next/image`, `sizes`, LQIP (`placeholder="blur"`, `blurDataURL` from Sanity 40px blur). Keep aspect and focus styles.

### 3.4 Modal route and project view

- **Intercepting route**: `src/app/(site)/@modal/(.)project/[slug]/page.tsx` — already in place; returns `<ProjectView project={...} isModal />` when navigating from index.
- **Full page**: `src/app/(site)/project/[slug]/page.tsx` — already returns `<ProjectView project={...} isModal={false} />` for direct load/refresh.
- **Close**: `ProjectView` uses `router.back()` when `isModal`; ensure back restores scroll (see 3.5).

### 3.5 Scroll restoration

- **Requirement**: When user opens project from index (modal), then closes (back or close button), index scroll position must be restored.
- **Approach**: On index, save `window.scrollY` (or container scroll) when navigating to `/project/[slug]` (e.g. in a wrapper or in `ImageBankCell`’s `Link` onClick, or via a layout effect that detects pathname change). Store in `sessionStorage` or React state (e.g. context). When returning to `/`, restore scroll in a `useEffect` that runs when pathname is `/` and we have a saved position.
- **Files to add/touch**: Either a small `ScrollRestoration` component in `(site)/layout.tsx` that reads pathname and restores scroll when pathname becomes `/`, or logic in a client wrapper around the grid. Save scroll on navigation away from `/` (e.g. in `ImageBankGrid` or a layout child that sees route change).

### 3.6 next/image + LQIP + sizes

- **Grid**: Already uses `next/image` with `fill`, `sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"`, `placeholder="blur"`, `blurDataURL` from Sanity. Ensure `urlFor(item.image)` uses hotspot (default with `builder.image(source)`).
- **Project gallery (MediaViewer)**: Add LQIP (blur placeholder) for current and next image where applicable. Use same `urlFor` + 40px blur for `blurDataURL`. Keep `sizes` appropriate (e.g. `(max-width: 768px) 100vw, 900px`).

### 3.7 Hotspot/crop

- `urlFor(source)` passes full image object (with `hotspot`/`crop`) to `builder.image(source)`; Sanity client applies it. No change needed if already using `urlFor` for all images.

---

## 4) QA_Perf_Checker — Acceptance checklist and bug fixes

### Acceptance checklist

- [ ] **Home**: Single flat grid of all images (all projects); no project title blocks or section headers.
- [ ] **Grid**: 2 cols mobile, 4–6 cols desktop; thin gap; full width; lazy load (more items on scroll).
- [ ] **Hover overlay**: Visible on desktop (pointer: fine); hidden on touch (no overlay on tap).
- [ ] **Click from home**: Opens project as modal; URL is `/project/[slug]`; modal has close and ESC.
- [ ] **Back/close**: Returns to index and restores previous scroll position.
- [ ] **Direct/refresh**: `/project/[slug]` in address bar or refresh shows full project page (not modal).
- [ ] **Project gallery**: Next/prev (buttons + arrows); ESC closes; next image preloaded.
- [ ] **Sanity**: Drag-drop reorder gallery; hotspot/crop on cover and gallery images; published filter (index only published); project ordering by indexOrder.
- [ ] **next/image**: Used for all images; correct `sizes`; LQIP blur placeholder on grid and project gallery.
- [ ] **SEO / existing**: Index, info, project metadata; sitemap; robots; studio at /studio unchanged.

### Bug fixes to apply

1. **Scroll restoration**: Implement save on navigate to `/project/[slug]`, restore when pathname returns to `/`. — **Done**: `ScrollRestoration` component in layout; `ImageBankCell` saves `indexScrollY` on click.
2. **Hover overlay desktop only**: In `ImageBankCell`, show overlay only for `pointer: fine` (e.g. media query or state from `matchMedia('(pointer: fine)')`). — **Done**: `isDesktop` + `showOverlay = hover && isDesktop`.
3. **MediaViewer LQIP**: Add blur placeholder for gallery images (current + next) using Sanity blur URL. — **Done**: Already uses `getBlurDataURL` for current image; preload for next is optional.

---

## 5) Final unified patch plan (files + steps)

| # | File(s) | Step |
|---|---------|------|
| 1 | `src/components/ImageBankCell.tsx` | Restrict hover overlay to desktop: use `matchMedia('(pointer: fine)')` (or CSS `@media (pointer: fine)`), show overlay only when `hover && isDesktop`. |
| 2 | `src/components/ImageBankGrid.tsx` + new or existing client wrapper | Save scroll position (e.g. `window.scrollY`) when child Link to `/project/...` is used (or when pathname leaves `/`). Store in `sessionStorage` key e.g. `indexScrollY`. |
| 3 | `src/app/(site)/layout.tsx` or new `ScrollRestoration` component | When pathname becomes `/`, read `sessionStorage.getItem('indexScrollY')`, apply `window.scrollTo(0, y)`, then clear key. Run in client effect. |
| 4 | `src/components/MediaViewer.tsx` | Add LQIP: for current and next image, compute `blurDataURL` (Sanity 40px blur), use `placeholder="blur"` and `blurDataURL` on `next/image`. |
| 5 | (Optional) `src/lib/data.ts` | Ensure only published projects in `getIndexProjects` (already uses `indexProjectsQuery` with `published == true`). |
| 6 | (Optional) `src/lib/queries.ts` | If product wants 404 for unpublished projects on direct load, add `&& published == true` to `projectBySlugQuery`; else leave as-is. |

---

## 6) Code-level guidance (what to edit where)

### ImageBankCell.tsx

- Add state or prop: `isDesktop` from `useEffect` + `window.matchMedia('(pointer: fine)')` and listener.
- Overlay: change condition from `hover` to `hover && isDesktop` (or use CSS: overlay `@media (pointer: coarse) { pointer-events: none; opacity: 0; }` so it never shows on touch).

### Scroll restoration

- **Option A**: In `ImageBankGrid`, add `usePathname()`. When pathname is `/`, in `useEffect` restore from `sessionStorage['indexScrollY']` and remove key. When pathname is not `/`, do nothing (saving can happen in cell).
- **Option B**: In a client component in layout that wraps or sits next to `{children}`, on pathname change: if leaving `/`, save `window.scrollY` to sessionStorage; if entering `/`, restore and clear.
- Saving trigger: either in `ImageBankCell`’s `Link` with `onClick={() => sessionStorage.setItem('indexScrollY', String(window.scrollY))}`, or in a layout effect that runs when pathname changes from `/` to `/project/...`.

### MediaViewer.tsx

- For the main `<Image>` (current image): add `placeholder="blur"` and `blurDataURL={urlFor(current.image)?.width(40).height(40).blur(10).url() ?? ''}`.
- For preload link (next image), optional to keep as-is; LQIP is for visible image.

---

## 7) Final acceptance criteria checklist

Use this as the sign-off list for V2.

1. Home is a single flattened grid of all images (no project blocks).
2. Grid is responsive (2 / 4–6 cols), thin gap, lazy load.
3. Hover overlay appears on desktop only; not on touch.
4. Click from home opens `/project/[slug]` as modal; URL updates; close/back returns to index.
5. Scroll position on index is restored after closing modal.
6. Direct load or refresh of `/project/[slug]` shows full page (no modal).
7. Project gallery: next/prev, ESC, close; next image preloaded.
8. Sanity: gallery reorder, hotspot/crop, published filter on index, project order by indexOrder.
9. All images use `next/image` with correct `sizes` and LQIP where applicable.
10. No regressions: info, studio, SEO, sitemap, robots work as before.
