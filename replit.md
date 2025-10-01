# Word Counter Plus - Text Analysis Tool

## Overview
Word Counter Plus is a comprehensive text analysis web application built with React, TypeScript, Vite, and Express. It provides advanced text analysis features including word counting, character counting, text case conversion, and various text manipulation tools.

## Project Structure

### Frontend (React + Vite)
- **Location**: `client/`
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Radix UI, Tailwind CSS
- **Router**: Wouter (lightweight React router)
- **State Management**: TanStack React Query

### Backend (Express)
- **Location**: `server/`
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with tsx for development
- **Features**: 
  - API routes with `/api` prefix
  - Static file serving in production
  - Vite dev server middleware in development
  - Blog post meta tag injection for SEO
  - GitHub integration for code upload

### Key Files
- `vite.config.ts` - Vite build configuration
- `server/index.ts` - Express server entry point
- `server/routes.ts` - API route definitions
- `server/vite.ts` - Vite dev server setup and SSR utilities
- `tsconfig.json` - TypeScript configuration

## Technology Stack

### Core
- React 18.3
- TypeScript 5.6
- Vite 6.3
- Express 4.21
- Node.js (ESM modules)

### UI & Styling
- Tailwind CSS 3.4
- Radix UI components
- Framer Motion (animations)
- Lucide React (icons)

### Tools & Libraries
- React Hook Form + Zod (form validation)
- Recharts (data visualization)
- jsPDF (PDF generation)
- Mammoth (DOCX parsing)
- date-fns (date utilities)

## Development Setup

### Scripts
- `npm run dev` - Start development server (port 5000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking

### Port Configuration
- **Frontend**: Port 5000 (required for Replit)
- **Host**: 0.0.0.0 (allows external access)
- **Proxy**: Configured with `allowedHosts: true` for Replit proxy

## Replit-Specific Configuration

### Proxy Configuration
The application is configured to work with Replit's proxy system:
- Server uses `0.0.0.0:5000` for frontend
- Vite middleware includes `allowedHosts: true` (server/vite.ts line 135)
- Express server configured for Replit environment

### Build Configuration
- Development: Uses Vite dev server with HMR
- Production: Builds to `dist/public/` directory
- Optimizations: Code splitting, tree shaking, terser minification

## Architecture Notes

### Development Flow
1. Express server starts on port 5000
2. In dev mode, Vite middleware handles all requests
3. Vite transforms and serves React application
4. API routes are prefixed with `/api`
5. All other routes fall through to React SPA

### Production Flow
1. Frontend built to `dist/public/`
2. Express serves static files from `dist/public/`
3. API routes available at `/api`
4. Fallback to index.html for client-side routing

### SEO Features
- Server-side meta tag injection for blog posts
- Open Graph and Twitter Card support
- Canonical URLs
- Sitemap generation (postbuild script)

## API Routes

### GitHub Integration
- `POST /api/upload-to-github` - Upload project to GitHub (requires authentication)

### Legacy Redirects
- `/text-case-converter` → `/text-case-convert`
- `/text-case` → `/text-case-convert`

## Replit Environment Setup

### Workflow Configuration
- **Workflow Name**: "Start application"
- **Command**: `npm run dev`
- **Port**: 5000
- **Output Type**: webview (frontend)

### Deployment Configuration
- **Target**: autoscale (stateless web application)
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Production Port**: 5000

### Verified Configurations
✅ All npm dependencies installed
✅ Replit proxy configuration verified (allowedHosts: true in server/vite.ts)
✅ Server binds to 0.0.0.0:5000 for external access
✅ Vite HMR working correctly
✅ Application tested and running successfully

## Recent Changes
- **2025-10-01**: GitHub import setup completed for Replit environment
  - Fixed React hooks error by:
    - Changed tsconfig.json JSX from "preserve" to "react-jsx"  
    - Added explicit React/React-DOM aliases in vite.config.ts
    - Configured React plugin with automatic JSX runtime
    - Reinstalled npm dependencies (1084 packages) to resolve module issues
  - Created "Start application" workflow on port 5000 with webview output
  - Verified Replit proxy configuration (allowedHosts: true)
  - Configured deployment for autoscale with build and start commands
  - Tested application successfully - all features working
  - Updated documentation with Replit-specific setup details

## User Preferences
None specified yet.
