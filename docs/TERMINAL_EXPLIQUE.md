# Ce que tu vois dans le terminal — explication

## La solution la plus simple : double-clic

À la racine du projet il y a un fichier **`LANCER_SITE.bat`**.

**Double-clique dessus** (dans l’explorateur de fichiers ou dans Cursor).  
Ça supprime le cache puis lance le site. Ouvre ensuite **http://localhost:3000** dans ton navigateur.

Pour arrêter le site : ferme la fenêtre noire (terminal) ou appuie sur Ctrl+C dedans.

---

## 1. Les erreurs « Cannot find module » (vendor-chunks, 925.js, 948.js)

**Cause :** Le cache de Next.js (dossier `.next`) est corrompu ou dépassé. Ça arrive souvent après une mise à jour ou des changements de dépendances.

**Ce que tu fais :** Une seule commande suffit maintenant :

```bash
npm run dev:fresh
```

(ou `pnpm run dev:fresh` si tu utilises pnpm.)

Ça supprime le cache puis relance le site. Plus besoin de toucher au dossier `.next` à la main.

---

## 2. « git n’est pas reconnu »

**Cause :** Git n’est pas installé sur ton PC, ou il n’est pas dans le PATH du terminal.

**Ce que tu fais :**
- **Option A :** Installe Git pour Windows : https://git-scm.com/download/win  
  Puis **ferme et rouvre** le terminal (ou Cursor). Ensuite :
  ```bash
  git add .
  git commit -m "MVP prêt"
  git push -u origin main
  ```
- **Option B :** Si le projet est déjà sur GitHub (via l’app GitHub Desktop ou le site), tu peux pousser le code depuis l’app GitHub Desktop au lieu du terminal.

---

## 3. Une commande pour tout lancer (sans toucher à rien)

| Ce que tu veux faire | Commande |
|----------------------|----------|
| Lancer le site en local (sans erreur de cache) | `npm run dev:fresh` |
| Vérifier que le build passe (avant Vercel) | `npm run ship` ou `npm run build:fresh` |
| Lancer le site normalement | `npm run dev` |

Après `dev:fresh` ou `dev`, ouvre **http://localhost:3000** dans ton navigateur.
