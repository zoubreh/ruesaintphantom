# QA_Perf_Checker — Deliverables

**Targets:** MVP Lighthouse Perf ~85+, no major CLS.

---

## 1) 10-minute test checklist (pass/fail)

Use this in order; total ~10 minutes. Mark **P**ass or **F**ail for each.

### Scroll restore
| # | Test | P/F | Notes |
|---|------|-----|-------|
| 1.1 | From index, scroll down so several rows are off-screen. Click a project (modal opens). Close modal (× or ESC). **Expected:** Page scroll position is where you left it. | | |
| 1.2 | Same as 1.1 but use **browser Back** instead of close button. **Expected:** Modal closes and scroll position is restored. | | |
| 1.3 | Scroll index, open project, navigate to next/prev image inside modal, then Back. **Expected:** Back to index with scroll restored (not to previous image). | | |

**Implementation:** Scroll is saved to `sessionStorage` when opening a project from the index (ImageBankCell Link onClick) and restored when the index mounts again (ImageBankGrid useEffect when pathname is `/`). If 1.1 or 1.2 fails, verify the key `indexScrollY` is written on click and that restore runs after Back.

---

### Back / forward behavior
| # | Test | P/F | Notes |
|---|------|-----|-------|
| 2.1 | Index → open project (modal) → Back. **Expected:** Index, modal gone, URL `/`. | | |
| 2.2 | Index → project A (modal) → close → project B (modal) → Back. **Expected:** Project A modal (or index depending on history). | | |
| 2.3 | Direct load `/project/foo` (full page). Click "Index". **Expected:** Navigate to `/`, not open modal. | | |
| 2.4 | Full page `/project/foo` → Browser Back. **Expected:** Previous page (e.g. index or referrer), not modal. | | |

---

### Modal route vs direct load
| # | Test | P/F | Notes |
|---|------|-----|-------|
| 3.1 | From index, click project. **Expected:** URL is `/project/[slug]`, content in modal overlay (not full-page replace). | | |
| 3.2 | Open `/project/[slug]` in new tab or refresh on that URL. **Expected:** Full project page (no modal, same content). | | |
| 3.3 | From index open project (modal). Refresh. **Expected:** Full project page at same URL. | | |
| 3.4 | Share link `/project/xyz`. Recipient opens. **Expected:** Full project page, not broken modal. | | |

---

### Mobile layout
| # | Test | P/F | Notes |
|---|------|-----|-------|
| 4.1 | Index at 375px width: grid is 2 columns, no horizontal scroll, tap targets ≥44px. | | |
| 4.2 | Modal on mobile: close button reachable, gallery image fits viewport, prev/next usable. | | |
| 4.3 | Header: Index / Info links and (if present) project title don’t overflow; no layout shift when title appears. | | |
| 4.4 | Info page: text readable, links tappable, no overflow. | | |

---

### next/image sizes + priority usage
| # | Test | P/F | Notes |
|---|------|-----|-------|
| 5.1 | Index grid: first ~6 images use `priority` (LCP candidates). **Check:** No layout shift when they load. | | |
| 5.2 | Index grid: `sizes` matches layout (e.g. 2 cols mobile → ~50vw, 4–6 cols desktop → ~20–25vw). **Check:** DevTools Network shows expected widths requested. | | |
| 5.3 | Project modal/full page: main gallery image has `priority` when it’s the first visible; others lazy. **Check:** First image loads without unnecessary delay. | | |
| 5.4 | All Sanity images go through `next/image` with valid `remotePatterns` (cdn.sanity.io). **Check:** No direct `<img>` for Sanity assets. | | |

---

### CLS and loading behavior
| # | Test | P/F | Notes |
|---|------|-----|-------|
| 6.1 | Index load: grid cells have fixed aspect ratio (e.g. 3/4); images use placeholder (blur) or dimensions so CLS ≈ 0. | | |
| 6.2 | Open project modal: modal overlay appears without main content jumping; gallery image has reserved space or placeholder. | | |
| 6.3 | Gallery next/prev: next image doesn’t collapse container (min height or aspect preserved); no big shift when new image loads. | | |
| 6.4 | Lighthouse (Mobile): **Cumulative Layout Shift** in “good” range (e.g. &lt; 0.1). No major CLS from fonts, header, or images. | | |

---

### Quick summary
- **Scroll restore:** 3 tests  
- **Back/forward:** 4 tests  
- **Modal vs direct:** 4 tests  
- **Mobile:** 4 tests  
- **next/image:** 4 tests  
- **CLS/loading:** 4 tests  

**Total:** 23 checks. Aim: all **P** for release; any **F** should be logged and fixed before calling MVP done.

---

## 2) Common failure modes — Next.js App Router modal routes (and fixes)

### 2.1 Scroll not restored when closing modal or using Back
- **Cause:** App Router doesn’t always restore scroll after client navigation; `scroll={false}` only prevents scroll-to-top on navigate, it doesn’t persist position.
- **Fix:** On the index (or list) page, save `window.scrollY` to `sessionStorage` before opening the modal (e.g. in `Link` onClick or in a layout effect when pathname becomes `/project/...`). On return to index (pathname `/`), read and `window.scrollTo(0, saved)` in a `useEffect` and clear the key. Optionally use a small delay or `requestAnimationFrame` so layout has been applied.

### 2.2 Modal shows when user lands directly on `/project/[slug]`
- **Cause:** Intercepting route `@modal(.)project/[slug]` can render for direct navigations if the segment matching is wrong or default slot isn’t used correctly.
- **Fix:** Interception only runs when navigating *from* the same segment (e.g. from `/`). Direct load / refresh uses the main `project/[slug]/page.tsx`. Ensure `default.tsx` returns `null` so when there’s no intercepted segment, no modal UI is shown. Your setup (parallel `@modal` + `default.tsx` returning `null`) is correct; keep it.

### 2.3 Full project page shows when expecting modal (or vice versa)
- **Cause:** Confusion between soft navigation (modal) and hard navigation (full page). Refresh or open in new tab always hits the real `project/[slug]` page.
- **Fix:** Document behavior: “From index → modal; direct URL or refresh → full page.” Use `router.back()` to close modal so history is consistent; avoid replacing history unless intentional.

### 2.4 Back button closes modal then goes back again (double-back)
- **Cause:** Some implementations push an extra history entry when opening the modal, so first Back closes modal and second Back leaves the page.
- **Fix:** Don’t push a dummy state. Use Next.js `<Link href="/project/slug">` from index; the framework manages history. Closing with `router.back()` pops one entry. Your current pattern is correct.

### 2.5 Modal content flashes or shows wrong project
- **Cause:** Modal slot and main slot both rendering; or stale data when switching projects quickly.
- **Fix:** Ensure layout renders `{children}` and `{modal}` with clear roles: when route is `/project/slug` from index, only the modal slot shows the project; when route is `/project/slug` as full page, `children` is the project page. Use a key (e.g. `slug`) on the modal content so React remounts when slug changes. Your modal page is keyed by route/params.

### 2.6 Body scroll not locked when modal is open
- **Cause:** Overflow on body not set when modal is visible.
- **Fix:** Use a hook (e.g. `useBodyScrollLock(isModal)`) that sets `document.body.style.overflow = 'hidden'` when modal is open and restores on cleanup. You already have this; ensure it runs when `isModal` is true for the intercepted route.

### 2.7 SEO / crawlers see empty or wrong content for `/project/[slug]`
- **Cause:** Modal route might be what gets rendered for the initial request in some setups.
- **Fix:** For direct requests to `/project/[slug]`, the **page** route must be the one that responds (with `generateMetadata` and full HTML). Interception is client-side; server should always return the full project page for that URL. Your `project/[slug]/page.tsx` handles this; keep metadata and content there.

---

## 3) Performance improvements (no visual design change)

Goals: better **LCP**, **CLS**, **TTFB**; same look and feel.

### 3.1 LCP (Largest Contentful Paint)
- **Index:** First 6 grid images already use `priority`; keep it. Ensure they have `placeholder="blur"` and `blurDataURL` (you do) so no flash of empty space.
- **Project (full page):** First visible gallery image should use `priority` and a small LQIP (e.g. Sanity blur URL) to avoid LCP delay. Already `priority` in `MediaViewer`; add `placeholder="blur"` and `blurDataURL` for the current slide to avoid layout jump.
- **Fonts:** Root layout uses `next/font` (Inter). No change needed; prevents FOIT and helps LCP stability.
- **Preload:** Optionally add `<link rel="preload" as="image" href="…">` for the LCP image URL in the project page (e.g. in `generateMetadata` or layout for that route) only if LCP is still high; measure first.

### 3.2 CLS (Cumulative Layout Shift)
- **Index grid:** Cells have aspect ratio and blur placeholders → good. Ensure container has no height: 0 before images load (you use aspect-[3/4]).
- **Modal / gallery:** In `MediaViewer`, give the image container a fixed aspect or min-height so when the next image loads it doesn’t collapse. Use `placeholder="blur"` and `blurDataURL` for the current (and optionally next) image so there’s no size jump.
- **Header:** Sticky header with fixed min-height (e.g. 44px) avoids shift. You have this.
- **Avoid:** Don’t inject content above the fold after first paint without reserved space (e.g. no late “banner” without min-height).

### 3.3 TTFB / server
- **Revalidate:** You use `revalidate = 60` on index and project; good for ISR. For MVP, 60s is acceptable; lower only if content must be fresher.
- **Data:** `getFlattenedGridItems` and `getProjectBySlug` use Sanity with `next: { revalidate }`. Ensure Sanity project is in same region as Vercel (or server) to reduce latency. No code change needed for design.
- **Streaming:** Index and project pages can use React Suspense with simple fallbacks (e.g. grid skeleton or project header skeleton) so TTFB is just the shell; content streams in. This doesn’t change final design, only loading sequence. Optional for MVP.

### 3.4 Other (no visual change)
- **Preload next image in gallery:** You use `<link rel="preload" as="image" href="…">` for the next slide; keep it. Reduces perceived delay on next/prev.
- **Lazy below-the-fold:** Grid already limits visible items and uses Intersection Observer; good. Keep `priority` only on first ~6.
- **Image `sizes`:** Index `sizes` matches grid (e.g. 2 / 4–6 cols). Project gallery `sizes="(max-width: 768px) 100vw, 900px"` is reasonable; no visual change to tighten further.

---

## Checklist summary

- Run the **23-item checklist** (~10 min); fix any **F** before MVP.
- Use **§2** when debugging modal/back/scroll issues.
- Apply **§3** for Lighthouse ~85+ and no major CLS without changing the visual design.
