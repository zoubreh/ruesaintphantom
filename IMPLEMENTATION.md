# Hawlin-like UX — Implementation Plan & QA

## 1. Implementation plan

### Goals
- **Home**: Flattened continuous image bank (all project images), dense full-width grid, no project title blocks. Desktop hover shows a tiny overlay (title / year / client). Click opens project as a modal route (`/project/[slug]`).
- **Modal vs full page**: From home, open project → URL becomes `/project/[slug]`, content shown in modal. Direct load or refresh on `/project/[slug]` → full page. Closing modal → back to home with **scroll position restored**.
- **Project gallery**: Next/prev (UI + keyboard arrows), ESC closes, preload next media. `next/image` everywhere with correct `sizes` and Sanity LQIP blur.
- **Constraints**: No portfolio-template layout; mobile 1–2 columns, no horizontal overflow.

### Approach
1. **Scroll restoration**  
   On home, before navigating to `/project/[slug]`, save `window.scrollY` in `sessionStorage`. When the index (ImageBankGrid) mounts again after closing the modal, read that value and restore scroll, then clear it.

2. **Modal close animation**  
   On close, set “closing” state, run opacity-out animation, then call `router.back()` in `onAnimationComplete` so the modal doesn’t unmount before the animation finishes.

3. **Project gallery**  
   Build media list as **cover first**, then gallery images. Use `getBlurDataURL()` for LQIP on current slide; preload next slide with a hidden `next/image` (no `<link rel="preload">` only). Keep next/prev buttons, keyboard (←/→, ESC), and touch swipe.

4. **Images**  
   Centralize Sanity LQIP in `getBlurDataURL()` in `lib/image.ts`. Use it in `ImageBankCell` and `MediaViewer`. Keep `sizes` responsive (grid cells and gallery viewer).

5. **Layout**  
   Add `overflow-x-hidden` and `w-full` on `main` (site layout) and `overflow-x-hidden` on `body` (root layout) to avoid horizontal scroll on mobile.

---

## 2. Files modified / created

| Action   | Path |
|----------|------|
| Modified | `src/lib/image.ts` — add `getBlurDataURL()` |
| Modified | `src/components/ImageBankCell.tsx` — save scroll on click, use `getBlurDataURL` |
| Modified | `src/components/ImageBankGrid.tsx` — restore scroll from `sessionStorage` on mount |
| Modified | `src/components/ProjectView.tsx` — `isClosing` state, animate out then `router.back()` |
| Modified | `src/components/MediaViewer.tsx` — cover-first media list, LQIP blur, preload next via hidden `next/image` |
| Modified | `src/app/(site)/layout.tsx` — `overflow-x-hidden w-full` on `main` |
| Modified | `src/app/layout.tsx` — `overflow-x-hidden` on `body` |
| Created  | `IMPLEMENTATION.md` — this file |

No new route or page files; intercepting route `(site)/@modal/(.)project/[slug]/page.tsx` and full page `(site)/project/[slug]/page.tsx` already provide modal-from-home vs full-page-on-load.

---

## 3. Code changes summary

- **`lib/image.ts`**: New `getBlurDataURL(source)` returning Sanity 40×40 blur URL for `placeholder="blur"`.
- **`ImageBankCell`**: `onClick` saves `window.scrollY` to `sessionStorage`; uses `getBlurDataURL(item.image)` and `placeholder={blurUrl ? 'blur' : 'empty'}`.
- **`ImageBankGrid`**: First `useEffect` on mount reads `sessionStorage` for saved scroll, restores with `requestAnimationFrame(() => window.scrollTo(0, y))`, then removes the key.
- **`ProjectView`**: `isClosing` state; `close()` sets it instead of calling `router.back()` immediately when modal; motion div `animate={{ opacity: isClosing ? 0 : 1 }}`, `onAnimationComplete` calls `router.back()` when closing; body scroll lock only when modal and not closing.
- **`MediaViewer`**: `getMediaItems()` returns `[cover, ...gallery]` when cover exists; current image uses `getBlurDataURL` and `placeholder="blur"`; next image preloaded via hidden `<Image>` in a zero-size container.
- **Layouts**: `main` gets `overflow-x-hidden w-full`; `body` gets `overflow-x-hidden`.

---

## 4. Quick manual QA steps

1. **Home grid**
   - [ ] Home shows one flat grid of all project images (no section titles). Mobile ~2 columns, desktop 4–6, full width, no horizontal scroll.
   - [ ] Desktop: hover on a cell shows a small overlay with project title and optionally year/client.
   - [ ] Each cell links to `/project/[slug]` (click or open in new tab from context menu to verify URL).

2. **Modal from home**
   - [ ] From home, click a cell → URL changes to `/project/[slug]`, project opens in a modal overlay (same window, index still “behind”).
   - [ ] Modal: close (×) → modal fades out, then you’re back on home and **scroll position is the same** as before opening.
   - [ ] Scroll home down, open a project, close → home scroll is restored to where you were.

3. **Full page project**
   - [ ] Open `/project/[slug]` in a new tab or refresh while on that URL → project loads as full page (no modal).
   - [ ] Full page: close button goes back to home (navigates to `/`).

4. **Project gallery**
   - [ ] Next/prev buttons advance the slide; keyboard ←/→ do the same.
   - [ ] ESC closes the modal (or exits full-page project view if that’s how you wired it).
   - [ ] First slide is the project cover; then gallery images in order.
   - [ ] Next image appears quickly (preload); current image shows LQIP blur then loads.

5. **Images & performance**
   - [ ] All images use `next/image` (no raw `<img>`). Grid and gallery use sensible `sizes`; no layout shift from missing dimensions.
   - [ ] Grid and gallery show Sanity LQIP blur while loading.

6. **Mobile**
   - [ ] 1–2 columns on small viewports, no horizontal overflow, touch scroll works; opening/closing project works and scroll restores after closing modal.
