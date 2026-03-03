# UX Spec — Haw-lin Style Image Bank Portfolio

**Role:** DA_Spec_Hawlin (Design/UX Spec Keeper)  
**Purpose:** Exact observable UX and visual rules for an image-first, minimal UI portfolio. Behavior and feel inspired by haw-lin-services.com — no code copied.

---

## 1. Strict UX Spec

### 1.1 Home (`/`)

| Rule | Specification |
|------|---------------|
| **Content** | One continuous image bank. All images from all projects are flattened into a single grid. No grouping by project, no section headers, no “Project A” / “Project B” blocks. |
| **Order** | Global order = project index order (e.g. `indexOrder`), then within each project: cover image first, then gallery items in array order. The result is one linear sequence of images. |
| **Layout** | Full-bleed grid from edge to edge (within safe margins). No centered max-width container wrapping the grid. |
| **Scroll** | Single vertical scroll. No horizontal scroll. No sticky headers over the grid (optional: minimal fixed nav; see Visual tokens). |

### 1.2 Hover (desktop only)

| Rule | Specification |
|------|---------------|
| **When** | Pointer over an image in the home grid. |
| **What** | A small, minimal overlay appears. Content: **project title** · **year** · **client** (or equivalent minimal metadata). |
| **Style** | “Tiny”: low visual weight, small type, short duration. No card, no heavy panel, no big background. Prefer subtle (e.g. semi-transparent bar or corner text). |
| **Mobile** | No hover. No overlay on touch. Tap = open project (no hover state). |

### 1.3 Click / Open project

| Rule | Specification |
|------|---------------|
| **From home** | Click on any image → navigate to `/project/[slug]` (slug of the project that image belongs to). **Modal route:** content is shown as an overlay (modal) over the index; URL updates to `/project/[slug]`. |
| **Closing** | Close (button or ESC) → modal closes, URL returns to `/`, **scroll position on home is restored exactly** (user lands where they left off). |
| **Direct load** | If user opens `/project/[slug]` directly (or refreshes on that URL) → show full project page, not modal. No “back to index” scroll to restore. |

### 1.4 Info (`/info`)

| Rule | Specification |
|------|---------------|
| **Layout** | Minimal text column. One narrow column of text (titles, body, links). No image bank here; text-first. |
| **Width** | Column width constrained (e.g. readable line length); not full-bleed paragraph text. |
| **Style** | Typography-led; plenty of whitespace; no cards or heavy sections. |

---

## 2. Visual Tokens

Define these in one place (e.g. design tokens or Tailwind config) and use consistently.

### 2.1 Background

| Token | Value / rule |
|-------|------------------|
| **Page background** | Single solid color (e.g. white or off-white). No gradients, no patterns on the main canvas. |
| **Grid area** | Same as page background; no alternating stripes or section backgrounds. |

### 2.2 Typography scale

| Use | Token / rule |
|-----|------------------|
| **Overlay (hover)** | Small, low-weight (e.g. 12–14px, regular or light). |
| **Info page** | Clear hierarchy: one size for headings, one for body; minimal steps (e.g. 2–3 sizes total). |
| **Project (modal/page)** | Title and captions use same scale; no oversized hero type unless explicitly in copy. |
| **General** | Restrained scale: few sizes, no decorative or heavy fonts. |

### 2.3 Spacing

| Token | Rule |
|-------|------|
| **Page edge** | Thin, consistent horizontal margin/gutter (e.g. 16–24px). No heavy padding. |
| **Vertical** | Minimal gap between grid items (see grid). No large section padding on home. |
| **Info column** | Comfortable vertical rhythm; no cramped lines. |

### 2.4 Grid

| Token | Rule |
|-------|------|
| **Gap** | Thin, uniform gap between images (e.g. 4–8px). Same horizontal and vertical. |
| **Columns (breakpoints)** | e.g. 1 col mobile, 2 cols small tablet, 4–6 cols desktop. No odd “3.5” or asymmetric column counts unless specified. |
| **Images** | Aspect ratios preserved (crop from CMS if needed). Grid is uniform in gap, not necessarily in cell size (masonry-like or uniform both allowed; specify one). |

Suggested mapping:

- **Mobile (e.g. &lt; 640px):** 1 column.
- **Narrow (e.g. 640–1024px):** 2 columns.
- **Desktop (e.g. &gt; 1024px):** 4–6 columns, thin gap.

---

## 3. DO NOT List

These are out of scope for the haw-lin-style image bank. Do not implement.

| # | Do not |
|---|--------|
| 1 | **Cards** — No card components (no borders, shadows, or rounded containers around images or projects on home). |
| 2 | **Big project headers** — No large “Project Title” or “Client Name” headers above project blocks on the home grid. No section titles per project. |
| 3 | **Section separation on home** — No horizontal rules, spacing blocks, or “Project 1 / Project 2” dividers. Home is one continuous grid. |
| 4 | **Centered containers** — No max-width centered wrapper for the main grid. Grid is full width (minus edge margin). |
| 5 | **Heavy padding** — No large padding (e.g. 48px+) around the grid or between “sections.” Keep padding and gap thin. |
| 6 | **Hover on mobile** — No hover overlays or hover-dependent info on touch devices. |
| 7 | **Decorative UI** — No unnecessary icons, badges, or heavy buttons on the image bank. Close and nav must be minimal and clear. |

---

## 4. Mobile-Specific Rules

| Rule | Specification |
|------|---------------|
| **Density** | Layout feels dense and clean: 1–2 columns, thin gap, no wasted space. |
| **Touch** | Images are tappable; tap opens project (modal route when from home). No hover overlay. |
| **Close** | Modal (project) must have a clear, tappable close control (button or icon). Easy thumb reach. |
| **Scroll** | Same single-direction scroll as desktop; close restores scroll position on home. |

---

## 5. Summary Checklist

- [ ] Home = one flat image bank; order = project order → cover + gallery order.
- [ ] Hover = tiny overlay (title · year · client), desktop only.
- [ ] Click from home → `/project/[slug]` as modal; close → back to `/`, scroll restored.
- [ ] Direct `/project/[slug]` → full page, not modal.
- [ ] `/info` = minimal text column.
- [ ] Visual tokens: single background, restrained typography, thin spacing and grid gap, defined columns per breakpoint.
- [ ] DO NOT: cards, big project headers, section separation on home, centered container for grid, heavy padding.
- [ ] Mobile: 1–2 columns, dense and clean, tappable close, no hover.

---

*Spec version: 1.0 — DA_Spec_Hawlin*
