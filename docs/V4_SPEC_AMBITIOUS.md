# V4 — Spec ambitieuse et structurée

**Constat :** On est sur une V0.1. Ce n’est pas un produit fini.  
**Objectif V4 :** Passer de prototype à produit fini — propre, cohérent, artistique, premium.

---

## 1️⃣ Problèmes actuels (corrigés en priorité)

### ✅ Frames cliquables (corrigé)
- **Problème :** Sur desktop, clic sur une image ne faisait rien.
- **Solution appliquée :**
  - Chaque frame = vrai `<Link href="/projects/[slug]">` (même comportement desktop + mobile).
  - `cursor: pointer` sur le lien.
  - Overlay au hover en `pointer-events-none` pour ne jamais bloquer le clic.
  - Hover : léger zoom (`group-hover:scale-[1.03]`).
  - Press : `active:scale-[0.98]`.
  - Focus visible : `focus-visible:ring-2`.

### ✅ Navigation active (corrigé)
- **Problème :** Menu ne reflétait pas la page active.
- **Solution appliquée :**
  - ● devant **Index** quand `pathname === '/'`.
  - ● devant **Info** quand `pathname === '/info'`.
  - `aria-current="page"` sur le lien actif.

### À consolider
- Transition fluide à l’ouverture du projet (voir §5).
- Vérifier en prod que le modal s’ouvre bien (Sanity / slug / redirect).

---

## 2️⃣ Direction V4 — Grille éditoriale asymétrique (type Hawlin)

**On ne veut plus :** une grille basique avec toutes les images au même format.

**On veut :**
- Une **grid éditoriale asymétrique**.
- **Formats variés :** 1 grande, 2 petites, 1 verticale, respirations.
- **Rythme visuel**, pas une stack uniforme.

### Implémentation Sanity
Chaque projet doit avoir :
- `slug`
- `coverImage`
- **`gridSize`** (enum) : `S` | `M` | `L` | `TALL` | `WIDE`
- **`order`** (ou logique de placement pour la home)
- `title`
- `year`
- `category` (optionnel)

La **taille dans la grid** est pilotée depuis Sanity.

### Implémentation front
- **CSS Grid** avec `grid-auto-flow: dense`.
- **Spans dynamiques** selon `gridSize` :
  - S = 1 col × 1 row
  - M = 2 cols × 1 row (ou 1×2)
  - L = 2×2
  - TALL = 1×2
  - WIDE = 2×1
- **Mobile :** grille simplifiée mais propre (ex. 2 colonnes, toutes les cells en 1×1 ou 1×2).

---

## 3️⃣ Page projet obligatoire

**Route :** `/projects/[slug]`

**Contenu :**
1. **Hero** : cover image (plein écran ou bandeau).
2. **Galerie** : suite d’images (et vidéos si besoin).
3. **Meta** : titre, année, type/catégorie.
4. **Description courte** (optionnel).
5. **Bouton back** (retour Index ou fermeture modal).
6. **Navigation next / previous** (projet précédent / suivant).

Une **vraie page projet**, pas juste une image. Même comportement en modal (depuis la home) et en page pleine (accès direct / refresh).

---

## 4️⃣ Thème — Light obligatoire

- **Pas de dark mode.** Le site doit être :
  - **Fond blanc**
  - **Typo noire / anthracite**
  - **UI minimaliste**
- Même si le système est en dark mode, **le site reste blanc** (pas de `prefers-color-scheme` pour basculer en dark).

**Implémentation :**
- Variables CSS : `--bg: #ffffff`, `--text: #0a0a0a`, `--muted: #525252`, `--border: #e5e5e5`.
- Tailwind : couleurs de thème basées sur ces variables.
- Pas de classe `dark:` pour le contenu principal.

---

## 5️⃣ Transitions premium

- **Au clic sur une frame :**
  - **Shared element transition** (idéal) : l’image s’agrandit et devient la hero du projet.
  - Transition fluide, élégante, pas de jump brutal.
- **Outils :** Framer Motion (layoutId, AnimatePresence) ou View Transitions API (navigator.sharedElement?.startViewTransition) si support suffisant.
- **Fallback :** au minimum un fade-in de la modal / page projet.

---

## 6️⃣ Propreté technique

- **Architecture :**
  - Composants réorganisés (dossiers par feature ou par type).
  - Suppression du code inutile (ResponsiveGrid / ProjectCard si plus utilisés, doublons).
- **SEO par projet :**
  - `title` + `meta description` + **OG image** (cover du projet).
  - `generateMetadata` dans `/projects/[slug]/page.tsx`.
- **Images :**
  - `next/image` partout, `sizes` corrects, LQIP Sanity.
- **Accessibilité minimale :**
  - Focus visible, `aria-current`, `aria-label` sur boutons, contraste suffisant (noir sur blanc).
- **Structure scalable :**
  - Constantes centralisées, types partagés, queries GROQ documentées.

---

## 7️⃣ Plan d’implémentation V4 (ordre recommandé)

| Phase | Tâche |
|-------|--------|
| **1** | Corriger clics + nav (fait). Vérifier en prod que modal et page projet s’ouvrent. |
| **2** | Thème light : CSS variables + Tailwind, supprimer toute dépendance au dark. |
| **3** | Sanity : ajouter `gridSize`, `order`, `category` au schéma projet. |
| **4** | Home : grille dense avec spans dynamiques (gridSize), `grid-auto-flow: dense`. |
| **5** | Page projet : hero, galerie, meta, description, back, next/prev. |
| **6** | Transitions : shared element ou fade fluide à l’ouverture projet. |
| **7** | Nettoyage : supprimer code mort, réorganiser composants, SEO et a11y. |

---

## 8️⃣ Résumé objectif V4

- **Home :** grille éditoriale asymétrique (formats variés, rythme), pilotée par Sanity.
- **Projet :** page complète (hero, galerie, meta, nav next/prev), cliquable et fluide.
- **Thème :** light uniquement, blanc / noir / minimal.
- **Technique :** propre, scalable, SEO et a11y corrects.
- **Expérience :** transitions premium, feedback hover/active, nav cohérente.

Si une base plus propre est nécessaire pour la stabilité (refactor ciblé ou réorganisation des dossiers), à faire en phase 7 sans tout casser.
