# Vercel Deployment Guide - Fixed for Full-Stack App

## Problem Solved
Your app was showing a blank page on Vercel because the Express backend wasn't being deployed. Vercel was only building the static frontend, causing all API calls to fail with 401 errors.

## Solution Implemented

### 1. Created Serverless API Function
- **File**: `/api/index.ts` - This is the entry point for Vercel serverless functions
- **File**: `/server/routes-serverless.ts` - Routes configured for serverless environment
- All your API routes (`/api/*`, `/sitemap.xml`, `/robots.txt`) now work as serverless functions

### 2. Updated Vercel Configuration
- **File**: `vercel.json` - Updated to route API requests properly
  - All `/api/*` requests go to the serverless function
  - Static files are served from the `/dist` directory
  - Client-side routing works correctly

### 3. Optimized Build Process
- **File**: `.vercelignore` - Excludes unnecessary files from deployment
- **File**: `api/tsconfig.json` - TypeScript configuration for serverless functions

## How to Deploy to Vercel

### Option 1: Via Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (if not already done)

2. **Go to Vercel Dashboard** (https://vercel.com/dashboard)

3. **Import your GitHub repository**
   - Click "Add New..." → "Project"
   - Select your repository from the list

4. **Configure the project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `vite build` (already set in vercel.json)
   - **Output Directory**: `dist` (already set in vercel.json)
   - **Install Command**: `npm install`

5. **Add Environment Variables** (if you have any):
   - Go to Settings → Environment Variables
   - Add any secrets your app needs:
     - `FIREBASE_PROJECT_ID`
     - `FIREBASE_CLIENT_EMAIL`
     - `FIREBASE_PRIVATE_KEY`
     - `RESEND_API_KEY`
     - `CONTACT_EMAIL`
     - etc.

6. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete (usually 2-3 minutes)
   - Your app will be live!

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## What Changed in Your Code

### New Files Created:
1. `/api/index.ts` - Serverless function entry point
2. `/server/routes-serverless.ts` - Routes adapted for serverless
3. `/api/tsconfig.json` - TypeScript config for API
4. `.vercelignore` - Files to exclude from deployment

### Modified Files:
1. `vercel.json` - Updated routing configuration

### Your Original Files Are Unchanged:
- `/server/index.ts` - Still works for local development
- `/server/routes.ts` - Still works for local development
- All frontend code - Unchanged

## Testing Locally

Your local development is unchanged and works the same way:

```bash
npm run dev
```

## Verifying Deployment

After deployment, test these URLs:

1. **Homepage**: `https://your-app.vercel.app/`
2. **API Route**: `https://your-app.vercel.app/api/contact` (POST request)
3. **Sitemap**: `https://your-app.vercel.app/sitemap.xml`
4. **Robots**: `https://your-app.vercel.app/robots.txt`

## Common Issues & Solutions

### Issue: Blank Page Still Shows
**Solution**: Check browser console for errors. Make sure all environment variables are set in Vercel dashboard.

### Issue: API Routes Return 404
**Solution**: Verify `vercel.json` rewrites are configured correctly. The file should have:
```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api" }
  ]
}
```

### Issue: Build Fails
**Solution**: 
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation succeeds locally with `npm run check`

### Issue: Environment Variables Missing
**Solution**: Add them in Vercel Dashboard → Settings → Environment Variables

## Deployment Checklist

Before deploying, make sure:

- [ ] All code is committed to GitHub
- [ ] Environment variables are added to Vercel dashboard
- [ ] Local build works: `npm run build`
- [ ] Local dev server works: `npm run dev`
- [ ] No sensitive keys in the code (use environment variables)

## Monitoring Your Deployment

After deployment:

1. **Check Vercel Logs**:
   - Go to your project in Vercel dashboard
   - Click on "Functions" tab to see serverless function logs

2. **Monitor Performance**:
   - Go to "Analytics" tab in Vercel dashboard
   - Check page load times and error rates

3. **Check Errors**:
   - Go to "Deployments" → Click on your deployment → "Functions" tab
   - View real-time logs of your serverless functions

## Key Differences: Local vs Vercel

| Feature | Local (Replit) | Vercel Production |
|---------|----------------|-------------------|
| Backend | Express server on port 5000 | Serverless functions |
| Frontend | Vite dev server | Static files in CDN |
| API Routes | Express routes | Serverless functions |
| Hot Reload | ✅ Yes | ❌ No (rebuild required) |
| Persistent State | ✅ Yes (in-memory) | ❌ No (use database) |

## Need Help?

If you encounter issues:

1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Test API routes using Postman or curl
4. Check browser console for frontend errors

Your app should now deploy successfully to Vercel! 🎉
