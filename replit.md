# Word Counter Plus - Replit Setup

## Project Overview
Word Counter Plus is a full-stack web application built with React (Vite) and Express. It provides text analysis tools including word counting, character counting, text case conversion, and more.

## Architecture
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express + TypeScript (using tsx for development)
- **Build System**: Vite for frontend, esbuild for server
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query v5)

## Replit Environment Setup

### Server Configuration
- **Port**: 5000 (required for Replit)
- **Host**: 0.0.0.0 for frontend
- **Vite Config**: `allowedHosts: true` configured for Replit proxy support

### Development
- Run: `npm run dev` (configured in workflow)
- The server starts both Express backend and Vite dev server on port 5000

### Production Build
1. Frontend build: `npm run build` → outputs to `dist/public`
2. Server build: `node build-server.js` → outputs to `dist/index.js`
  - Note: A build-server.js script was created to compile TypeScript server code using esbuild
3. Start: `npm run start` → runs compiled `dist/index.js`

### Deployment Configuration
- Target: autoscale
- Build command: `bash -c "npm run build && node build-server.js"`
- Run command: `node dist/index.js`

## Known Issues

### React Hook Warnings
The application shows console warnings about invalid hook calls related to `useContext` in next-themes. These are non-blocking warnings that don't prevent the app from functioning. The error appears to be related to how next-themes integrates with the Replit runtime error overlay plugin.

**Current Status**: The warnings are present but the application loads and functions correctly when the runtime error overlay is dismissed.

**Potential Solutions** (not yet implemented):
- The issue may be related to React module resolution or the runtime error overlay plugin
- Consider using a different theme solution or investigating React bundling configuration

## File Structure
```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # React components (UI, layout, features)
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   └── data/         # Static data and configuration
│   └── index.html
├── server/               # Backend Express server
│   ├── index.ts          # Main server file
│   ├── routes.ts         # API routes
│   └── vite.ts           # Vite middleware setup
└── shared/               # Shared types and schemas

## Environment Variables
- `NODE_ENV`: development | production
- `PORT`: 5000 (default, required for Replit)
- `VITE_MAIN_HOST`: Main domain (defaults to wordcounterplusapp.com)
- `VITE_CASE_HOST`: Text case converter subdomain

## Recent Changes (Oct 1, 2025)
1. Configured for Replit environment with proper port (5000) and host (0.0.0.0) settings
2. Verified `allowedHosts: true` in vite middleware for Replit proxy support
3. Created server build script (build-server.js) using esbuild for production compilation
4. Configured deployment settings for autoscale target
5. Replaced custom ThemeProvider with next-themes library wrapper
6. Workflow configured with webview output type on port 5000

## Next Steps
- Monitor and address React hook warnings if they cause functional issues
- Consider alternative theming solutions if warnings persist
- Test production build and deployment
