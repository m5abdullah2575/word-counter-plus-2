import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import viteImagemin from "vite-plugin-imagemin";
import webp from "imagemin-webp";

// Small helper to resolve paths
const r = (...segments: string[]) => path.resolve(process.cwd(), ...segments);

export default defineConfig({
  base: '/',
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined
      ? [
          (await import("@replit/vite-plugin-cartographer")).cartographer(),
        ]
      : []),
    // Image optimization - only in production
    ...(process.env.NODE_ENV === "production"
      ? [
          viteImagemin({
            gifsicle: { optimizationLevel: 7, interlaced: false },
            optipng: { optimizationLevel: 7 },
            mozjpeg: { quality: 85, progressive: true },
            pngquant: { quality: [0.65, 0.8], speed: 4 },
            svgo: {
              plugins: [
                { name: "removeViewBox", active: false },
                { name: "removeEmptyAttrs", active: false },
              ],
            },
          }),
        ]
      : []),
  ],

  resolve: {
    alias: {
      "@": r("client", "src"),
      "@shared": r("shared"),
      "@assets": r("attached_assets"),
      "react": path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom"),
    },
  },

  root: r("client"),

  build: {
    outDir: r("dist/public"),
    emptyOutDir: true,
    target: "esnext", // ✅ modern browsers only
    cssCodeSplit: true,
    sourcemap: false,
    minify: "esbuild",
    cssMinify: 'lightningcss',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core vendor (React)
          if (id.includes("react") || id.includes("react-dom")) return "vendor";
          // Router
          if (id.includes("wouter")) return "routing";
          // Query client
          if (id.includes("@tanstack/react-query")) return "query";
          // UI framework core
          if (id.includes("@radix-ui") && (id.includes("slot") || id.includes("primitive"))) return "ui-core";
          // Heavy libs - keep separate for lazy loading
          if (id.includes("jspdf")) return "pdf";
          if (id.includes("pdfjs-dist")) return "pdf-reader";
          if (id.includes("mammoth") || id.includes("docxtemplater")) return "docx";
          if (id.includes("recharts")) return "charts";
          if (id.includes("framer-motion")) return "motion";
          // Icons - separate chunk
          if (id.includes("lucide-react") || id.includes("react-icons")) return "icons";
          // Utils
          if (id.includes("clsx") || id.includes("tailwind-merge")) return "utils";
          // Forms
          if (id.includes("react-hook-form") || id.includes("@hookform/resolvers") || id.includes("zod")) return "form";
          // UI components - lazy load
          if (id.includes("@radix-ui") || id.includes("input-otp") || id.includes("react-day-picker") || id.includes("embla-carousel")) return "ui-components";
        },
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name || "")) return `images/[name]-[hash][extname]`;
          if (/\.css$/i.test(assetInfo.name || "")) return `css/[name]-[hash][extname]`;
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || "")) return `fonts/[name]-[hash][extname]`;
          return `assets/[name]-[hash][extname]`;
        },
      },
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
    },
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096, // Inline assets smaller than 4KB
  },

  server: {
    host: "0.0.0.0",
    port: 5000,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },

  optimizeDeps: {
    include: ["react", "react-dom", "wouter", "@tanstack/react-query", "recharts"],
    exclude: ["@replit/vite-plugin-cartographer"],
    esbuildOptions: {
      target: "esnext", // ✅ force modern deps
    },
  },

  css: {
    devSourcemap: false,
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
        ...(process.env.NODE_ENV === "production"
          ? [
              cssnano({
                preset: [
                  "default",
                  {
                    discardComments: { removeAll: true },
                    normalizeWhitespace: true,
                    mergeLonghand: true,
                    mergeRules: true,
                  },
                ],
              }),
            ]
          : []),
      ],
    },
  },
});
