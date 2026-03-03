# Deploy to Vercel — Step-by-step checklist

1. **Connect GitHub repo to Vercel**
   - Vercel Dashboard → Add New → Project → Import Git Repository.
   - Select the repo. Framework: Next.js (auto-detected). Deploy.

2. **Set environment variables**
   - Project → Settings → Environment Variables. Add (Production + Preview):
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = your Sanity project ID
   - `NEXT_PUBLIC_SANITY_DATASET` = `production` (or your dataset)
   - `NEXT_PUBLIC_SANITY_API_VERSION` = `2024-01-01`
   - `NEXT_PUBLIC_SITE_URL` = `https://<your-app>.vercel.app` (or custom domain)
   - Redeploy after saving.

3. **Sanity CORS**
   - sanity.io/manage → your project → Settings → API → CORS origins.
   - Add: `https://<your-vercel-domain>.vercel.app`
   - If using a custom domain, add it too.
   - Enable **Allow credentials** (required for embedded Studio at `/studio`).
   - Save.

4. **Custom domain (optional)**
   - Vercel: Settings → Domains → add domain.
   - Add the same domain in Sanity CORS with Allow credentials.
   - Set `NEXT_PUBLIC_SITE_URL` to your production URL (e.g. `https://yoursite.com`).

5. **Verify**
   - Home loads with flat image grid; `/project/[slug]` works; `/studio` loads (after CORS); `pnpm build` passes locally.
