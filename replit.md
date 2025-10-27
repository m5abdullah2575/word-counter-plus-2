# Word Counter Plus - Replit Setup

## Overview
Word Counter Plus is a full-stack web application providing a comprehensive suite of text analysis tools, including word counting, character counting, text case conversion, readability analysis, and paraphrasing. Its primary purpose is to attract high-value organic traffic through SEO-optimized tools and content, targeting key markets like education, content creation, and marketing. The project aims to maximize ad revenue, particularly from high RPM countries, by focusing on performance, mobile responsiveness, and an automated SEO infrastructure.

## User Preferences
I want the agent to prioritize developing features that directly contribute to increasing ad revenue and organic traffic from high-RPM countries. Focus on implementing tools and SEO strategies identified in the "Next Steps for Maximum Ad Revenue" section. When making changes, prioritize performance and SEO best practices. I prefer to be informed about major architectural decisions or significant changes to existing features before they are implemented. Do not make changes to the existing `client/src/data/blogs/` directory unless it's to add new blog posts as per content strategy, and ensure that any changes are production-ready with zero LSP errors.

## System Architecture
The application is built with a modern full-stack architecture optimized for performance and scalability.

-   **UI/UX Decisions**: The frontend prioritizes a clean, intuitive, and mobile-first responsive design using Tailwind CSS and shadcn/ui components. Consistent grid-based layouts, adaptive typography, and smooth animations are applied across all tools.
-   **Technical Implementations**:
    -   **Frontend**: Developed with React 18, Vite, TypeScript, Wouter for routing, and TanStack Query (React Query v5) for state management.
    -   **Backend**: Utilizes Express and TypeScript, with `tsx` for development and `esbuild` for production.
    -   **Performance Optimizations**: Achieves sub-2 second load times through aggressive gzip compression (level 6), intelligent caching (1-year for static assets, 1-hour for HTML), advanced code splitting, resource hints (prefetch, preconnect), and a service worker for offline support and asset caching.
    -   **SEO Infrastructure**: Incorporates dynamically generated sitemaps and robots.txt, automated blog post indexing, comprehensive meta-tag optimization for high-CPC keywords, and extensive structured data (e.g., FAQ schema).
    -   **Browser Extension**: A comprehensive Chrome/Firefox extension (Manifest V3) offering multi-tab analysis, keyword tools, text manipulation, history, and various export options, all processed locally for privacy.
-   **Feature Specifications**: Core tools include word/character/line/paragraph/sentence counting, text case conversion, readability analysis (Flesch-Kincaid, Gunning Fog), and an AI-powered paraphrasing tool. All tools support file uploads, auto-save, and export functionality. The contact form features a professional subject dropdown with dynamic custom input and Firebase Firestore for scalable message storage.
-   **System Design Choices**:
    -   **Build System**: Vite is configured for advanced code splitting, optimized Terser minification, and tree-shaking to produce a minimized bundle size, targeting modern ES2020+ browsers.
    -   **Deployment**: Optimized for Replit's autoscale target with specific build and run commands.
    -   **Database**: Firebase Firestore is used for contact form message storage, replacing PostgreSQL for increased capacity and scalability.

## External Dependencies
-   **React 18**: Frontend library.
-   **Vite**: Frontend build tool.
-   **TypeScript**: Language for type-safe development.
-   **Tailwind CSS**: Utility-first CSS framework.
-   **shadcn/ui**: UI component library.
-   **Express**: Backend web framework.
-   **tsx**: TypeScript execution for Node.js (development).
-   **esbuild**: Fast JavaScript bundler for server compilation.
-   **Wouter**: Client-side routing.
-   **TanStack Query (React Query v5)**: Asynchronous state management.
-   **Firebase Firestore**: Database for contact messages.
-   **firebase-admin**: Server-side Firebase SDK.
-   **next-themes**: For theme management.
-   **Google AdSense**: For monetization.
-   **Google Search Console**: For SEO monitoring.
-   **Font Awesome**: Icon library.
-   **jsPDF**: PDF generation for document exports.

## Cloud Storage Integration
The application now supports direct file uploads to multiple cloud storage providers through the download page:
-   **Google Drive**: Upload files directly using Google Drive API v3
-   **Dropbox**: Save files to Dropbox using Dropbox API v2
-   **OneDrive**: Upload to Microsoft OneDrive using Microsoft Graph API
-   **Box**: Store files in Box using Box API v2.0

**Backend API Routes** (`server/routes.ts`):
-   `/api/cloud-storage/status` - Check which cloud services are connected
-   `/api/cloud-storage/google-drive/upload` - Upload files to Google Drive
-   `/api/cloud-storage/dropbox/upload` - Upload files to Dropbox
-   `/api/cloud-storage/onedrive/upload` - Upload files to OneDrive
-   `/api/cloud-storage/box/upload` - Upload files to Box

**Integration Setup**: Cloud storage integrations use Replit's connector system. Users must connect their accounts through the Replit integrations panel before they can upload files to cloud storage services. The Download page automatically detects connection status and displays visual badges indicating which services are available.

## Deployment Configuration
The application supports both local development and production deployment to Vercel:

### Local Development (Replit)
- Server runs on port 5000 with full Express backend
- Hot module replacement enabled via Vite
- Uses `server/index.ts` as entry point

### Production Deployment (Vercel)
- **Serverless Architecture**: Backend API routes run as Vercel serverless functions
- **Files**:
  - `/api/index.ts` - Serverless function entry point
  - `/server/routes-serverless.ts` - Routes optimized for serverless environment
  - `vercel.json` - Deployment configuration with proper routing
  - `.vercelignore` - Excludes unnecessary files from deployment
- **Routing**:
  - All `/api/*` requests are routed to serverless functions
  - Static frontend files served from `/dist` directory
  - Client-side routing handled via rewrites to `/index.html`
- **Build Process**: 
  - Frontend: `vite build` generates optimized static files
  - Backend: Serverless functions compiled automatically by Vercel
- **Environment Variables**: Must be configured in Vercel dashboard for production

See `VERCEL_DEPLOYMENT_FIXED.md` for detailed deployment instructions.