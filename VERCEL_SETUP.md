# Vercel Deployment Setup

## Steps (Do in order):

### 1. Database Setup (Neon shown in your screenshots)
Already created - ✅

### 2. Add Environment Variable in Vercel
- Go to: Settings → Environment Variables
- Add: `DATABASE_URL`
- Value: Your connection string from Neon (shown in screenshot)
- Click "Save"

### 3. Redeploy
- Go to Deployments tab
- Click "..." on latest deployment
- Click "Redeploy"

Done. Contact form will work.
