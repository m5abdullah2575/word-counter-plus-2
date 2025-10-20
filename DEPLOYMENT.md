# Vercel Deployment Guide for Word Counter Plus

This guide will help you deploy Word Counter Plus to Vercel successfully.

## Prerequisites

1. **GitHub Account**: You need a GitHub account to connect with Vercel
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Firebase Setup** (Optional): For contact form functionality

## Step 1: Push Code to GitHub from Replit

### Option A: Using Replit's Git Interface

1. Click on the **Git** icon in the left sidebar of Replit
2. If not initialized, click **Initialize Git Repository**
3. Click **Connect to GitHub**
4. Authorize Replit to access your GitHub account
5. Create a new repository or connect to an existing one
6. **Stage all changes**: Check all files in the Git pane
7. **Commit** with message: "Initial commit - Word Counter Plus"
8. **Push** to GitHub

### Option B: Using Replit Shell

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Word Counter Plus"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

## Step 2: Deploy to Vercel

### Method 1: Import from GitHub (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository (authorize if needed)
5. Vercel will auto-detect the framework settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run vercel-build` (already configured)
   - **Output Directory**: `dist/public` (already configured)
   - **Install Command**: `npm install`

6. Click **"Deploy"**

### Method 2: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Step 3: Configure Environment Variables (Optional)

If you're using Firebase for contact form or other features:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
RESEND_API_KEY=your-resend-key (optional, for email notifications)
```

4. Click **Save**
5. **Redeploy** your project for changes to take effect

## Step 4: Configure Custom Domain (Optional)

1. In Vercel project dashboard, go to **Settings** → **Domains**
2. Add your custom domain (e.g., `wordcounterplus.com`)
3. Follow Vercel's instructions to update your DNS settings
4. Wait for DNS propagation (can take up to 24 hours)

## Verification Checklist

After deployment, verify the following:

- [ ] Site loads correctly at the Vercel URL
- [ ] All pages are accessible (Home, Tools, About, Contact, etc.)
- [ ] Navigation works properly
- [ ] Text counter tools function correctly
- [ ] File upload works
- [ ] Export functionality works
- [ ] Dark/Light mode toggle works
- [ ] Contact form submits successfully (if Firebase is configured)
- [ ] SEO meta tags are present (check page source)
- [ ] Sitemap is accessible at `/sitemap.xml`

## Troubleshooting

### Build Fails

**Issue**: Build process runs out of memory
**Solution**: Vercel has larger build resources. If it still fails:
- Check for circular dependencies
- Reduce bundle size by removing unused packages

### Pages Return 404

**Issue**: Direct URL navigation shows 404
**Solution**: Already configured in `vercel.json` with rewrites. Ensure the vercel.json is in the root directory.

### Environment Variables Not Working

**Issue**: Features requiring env vars don't work
**Solution**: 
1. Double-check variable names (no typos)
2. Ensure you've redeployed after adding variables
3. For client-side vars, prefix with `VITE_`

### Contact Form Not Working

**Issue**: Contact form submissions fail
**Solution**: 
1. Verify Firebase credentials are correctly set in Vercel
2. Check Firebase Firestore rules allow writes
3. Ensure `FIREBASE_PRIVATE_KEY` includes proper line breaks (use `\n`)

## Performance Optimization

The project is already optimized for Vercel with:

- ✅ Vite build system for fast builds
- ✅ Code splitting and lazy loading
- ✅ Gzip compression headers
- ✅ SEO optimization
- ✅ Sitemap generation
- ✅ Security headers (configured in vercel.json)

## Monitoring & Analytics

After deployment:

1. **Vercel Analytics**: Enable in project settings for performance insights
2. **Google Search Console**: Submit sitemap at `https://yourdomain.com/sitemap.xml`
3. **Error Tracking**: Monitor Vercel deployment logs for errors

## Continuous Deployment

Once connected to GitHub:

1. Every push to `main` branch triggers automatic deployment
2. Pull requests create preview deployments
3. View deployment status in Vercel dashboard

## Support

For deployment issues:
- Vercel Docs: https://vercel.com/docs
- Replit Git Docs: https://docs.replit.com/programming-ide/git-and-version-control
- Project Issues: Create an issue in your GitHub repository

---

**Last Updated**: October 17, 2025
**Project**: Word Counter Plus
**Stack**: React + Vite + Express + Firebase
