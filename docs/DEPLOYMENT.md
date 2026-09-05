# Vercel Deployment & Production Guide

## Architecture on Vercel
TrackPulse is engineered for serverless deployment on Vercel:
1. **Lightweight Artifacts**: Heavy ML training happens offline / on Kaggle. The production Next.js runtime only bundles compact precomputed JSON/Parquet models and statistics (`< 15MB`).
2. **Serverless APIs**: All route handlers (`/api/trains/[id]/eta`, `/api/network/analyze`, `/api/recommend`, `/api/simulate`, `/api/pnr/status`, `/api/sms/inbound`) execute within standard Vercel serverless functions with fast sub-100ms response times.
3. **Zero Heavy CSV Bundling**: Large raw CSVs (`ir_train.csv`, Spark partitions) are excluded from the Vercel production bundle via `.vercelignore` and `.gitignore`.

---

## Deployment Steps

### 1. Direct CLI Deployment
```bash
# Install Vercel CLI if needed
npm install -g vercel

# Deploy directly to Vercel
vercel
```

### 2. GitHub / Vercel Web Dashboard
1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import the GitHub repository.
4. Framework Preset: **Next.js**.
5. Build Command: `npm run build`.
6. Output Directory: `.next`.
7. Click **Deploy**.

---

## Environment Variables
Create `.env.local` for local development:
```env
NEXT_PUBLIC_APP_NAME=TrackPulse
NEXT_PUBLIC_ENVIRONMENT=production
```
