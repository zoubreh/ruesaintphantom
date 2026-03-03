# V3 FINISH — Spec Hawlin-like (appliquée)

## Fait

### 1) Structure
- **Header** : Index + Info uniquement (déjà en place).
- **Home** : un seul flux, grille continue (image bank), pas de cartes ni blocs titre. Infos projet au hover (desktop) uniquement.
- **Routes projet** : `/projects/[slug]` (plus `/project/`). Depuis la home → ouverture en modal ; accès direct / refresh → page pleine. Retour = scroll restauré.

### 2) Home Image bank
- **Data** : `homeGridQuery` → tous les projets `published=true`, flatten cover + gallery, ordre `indexOrder` puis ordre galerie.
- **Grid** : CSS Grid, full width, padding minimal.
- **Breakpoints** : 1 col (<420px), 2 (≥420), 3 (640), 4 (1024), 5 (1280), 6 (1536). Gap 6–8px.
- **Items** : `aspect-[3/4]`, `object-cover`, pas de bordures/ombres. Overlay au hover : Title — Year · Client.
- **Click** : ouvre `/projects/[slug]` en modal, URL mise à jour ; fermeture (× ou back) → retour à la home, scroll restauré.
- **Lazy load** : IntersectionObserver + 1–2 images en `priority` (LCP).

### 3) Projet (viewer)
- Titre (contexte header), bouton × pour fermer, suite d’images (MediaViewer), **bloc crédits** en bas.
- **Credits** : champ Sanity `credits[]` (label, value, url). Rendu minimaliste sous la galerie.
- Depuis la home → modal ; refresh direct → page pleine. ESC ferme le modal.

### 4) Info
- Une colonne de texte simple, liens mail + reps (inchangé).

### 5) Motion
- Ouverture projet (modal) : fade-in + léger scale (0.98 → 1). Fermeture : fade-out + scale.

### 6) Performance
- `next/image` partout, `sizes` adaptés, LQIP Sanity, lazy load, 2 images en priority sur la home.

### 7) CMS Sanity
- **Projets** : title, slug, year, client, tags, published, indexOrder, **credits[]** (label, value, url), gallery[] (reorder, hotspot/crop, alt/caption).
- Ordre home : `indexOrder` + ordre des items dans la galerie (pas de singleton homeFeed en V3).

### 8) Déploiement
- Next sur Vercel, `/studio` servi par Next. Sanity en backend ; CORS à configurer pour `https://*.vercel.app` + domaine final.

## Fichiers modifiés / ajoutés

- `src/app/(site)/projects/[slug]/page.tsx` + `not-found.tsx` (nouvelles routes).
- `src/app/(site)/@modal/(.)projects/[slug]/page.tsx` (interception modal).
- Suppression de `(site)/project/` et `@modal/(.)project/`.
- `src/components/ImageBankCell.tsx` : lien `/projects/`, overlay hover desktop.
- `src/components/ImageBankGrid.tsx` : breakpoints V3, gap 6–8px, 2 priority.
- `src/components/ProjectView.tsx` : bloc crédits, motion scale + fade.
- `sanity/schemas/project.ts` : champ `credits[]`.
- `src/lib/queries.ts` : `credits` dans projectFields.
- `src/types/sanity.ts` + `project.ts` : type `ProjectCredit` / `credits`.
- `src/app/sitemap.ts` : URLs `/projects/`.
- `src/components/ProjectCard.tsx` : lien `/projects/`.
- `README.md` : routes et crédits.
