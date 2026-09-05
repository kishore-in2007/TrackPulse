# Vercel Deployment & Production Guide

## Architecture on Vercel
TrackPulse is engineered from the ground up for seamless serverless deployment on Vercel:
1. **Lightweight Production Bundle**: Machine learning training artifacts and seed data are structured into compact, memory-efficient JSON structures (`< 25MB`).
2. **Optimized Serverless APIs**: All route handlers (`/api/trains/[id]/eta`, `/api/network/analyze`, `/api/recommend`, `/api/simulate`, `/api/pnr/status`, `/api/sms/inbound`) execute within standard Vercel serverless functions with fast sub-50ms response times.
3. **Trace Inclusions**: Configured with `outputFileTracingIncludes` in `next.config.mjs` ensuring all canonical schedules and ML weights are bundled into Vercel Lambdas.
4. **Zero Heavy CSV Bundling**: Large raw CSVs and intermediate notebook caches are excluded from the Vercel production bundle via `.vercelignore` and `.gitignore`.

---

## Deployment Options

### Option 1: Automatic Continuous Deployment (Recommended)
1. Push code to the repository: [https://github.com/kishore-in2007/TrackPulse](https://github.com/kishore-in2007/TrackPulse)
2. Log in to [Vercel Dashboard](https://vercel.com/new).
3. Select **"Import Project"** and choose `TrackPulse`.
4. Framework Preset: **Next.js** (auto-detected).
5. Root Directory: `./` (or leave default).
6. Click **Deploy**. Vercel will automatically build and deploy the app with instant edge CDN distribution.

### Option 2: Deploy via Vercel CLI
```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Deploy directly from the project directory
vercel

# Deploy to production domain
vercel --prod
```

---

## Environment Variables (Optional)
The system works out-of-the-box with high-fidelity simulated telemetry. If connecting external services, configure these in the **Vercel Project Settings > Environment Variables**:

```env
NEXT_PUBLIC_APP_NAME=TrackPulse
NEXT_PUBLIC_ENVIRONMENT=production

# Optional external live feeds:
CRIS_API_KEY=
RAPIDAPI_KEY=
OPENWEATHER_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

