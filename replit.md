# Word Counter Plus - Replit Setup

## Overview
Word Counter Plus is a full-stack web application offering a suite of text analysis tools, including word counting, character counting, text case conversion, readability analysis, and paraphrasing. The project aims to capture high-value organic traffic through SEO-optimized tools and content, targeting niches like education, content creation, and marketing to maximize ad revenue, particularly from high RPM (Revenue Per Mille) countries. The application is built with a focus on performance, mobile responsiveness, and an automated SEO infrastructure.

## User Preferences
I want the agent to prioritize developing features that directly contribute to increasing ad revenue and organic traffic from high-RPM countries. Focus on implementing tools and SEO strategies identified in the "Next Steps for Maximum Ad Revenue" section. When making changes, prioritize performance and SEO best practices. I prefer to be informed about major architectural decisions or significant changes to existing features before they are implemented. Do not make changes to the existing `client/src/data/blogs/` directory unless it's to add new blog posts as per content strategy, and ensure that any changes are production-ready with zero LSP errors.

## System Architecture
The application features a modern full-stack architecture.
-   **Frontend**: Built with React 18, Vite, TypeScript, Tailwind CSS, and shadcn/ui for a responsive and modern user interface. Wouter is used for client-side routing, and TanStack Query (React Query v5) manages state. UI/UX design emphasizes clean, intuitive interfaces and mobile-first responsiveness across all tools.
-   **Backend**: Developed with Express and TypeScript, utilizing `tsx` for development and `esbuild` for production compilation. The server handles API routes and dynamic content generation, such as the sitemap.
-   **Build System**: Vite for the frontend and a custom `build-server.js` script with `esbuild` for the backend ensure optimized production builds.
-   **Deployment**: Configured for Replit's autoscale target, with specific build and run commands for a seamless deployment process.
-   **SEO Infrastructure**: Includes dynamically generated sitemaps and robots.txt, automated blog post indexing, and comprehensive meta-tag optimization for high-CPC keywords and international targeting (US, UK, CA, AU). Structured data (e.g., FAQ schema) is extensively used.
-   **Key Features**: Core features include word/character counting, text case conversion, readability analysis (Flesch-Kincaid, Gunning Fog, etc.), and an AI-powered paraphrasing tool with multiple modes. All tools support responsive design, file upload, and export functionality.

## External Dependencies
-   **React 18**: Frontend library.
-   **Vite**: Frontend build tool.
-   **TypeScript**: For type-safe development across the stack.
-   **Tailwind CSS**: Utility-first CSS framework.
-   **shadcn/ui**: UI component library.
-   **Express**: Backend web framework.
-   **tsx**: TypeScript execution for Node.js in development.
-   **esbuild**: Fast JavaScript bundler for server compilation.
-   **Wouter**: Client-side routing library.
-   **TanStack Query (React Query v5)**: Asynchronous state management.
-   **next-themes**: For theme management in the UI.
-   **Google AdSense**: For monetization through advertisements.
-   **Google Search Console**: For SEO monitoring and indexing.
-   **Font Awesome**: For icons (e.g., FaBookReader, FaExchangeAlt).