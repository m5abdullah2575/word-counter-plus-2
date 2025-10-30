import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import viteImagemin from "vite-plugin-imagemin";
import webp from "imagemin-webp";
import purgecss from "@fullhuman/postcss-purgecss";

// Small helper to resolve paths
const r = (...segments: string[]) => path.resolve(process.cwd(), ...segments);

export default defineConfig({
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
    target: "esnext",
    cssCodeSplit: false,
    cssMinify: 'lightningcss',
    sourcemap: false,
    modulePreload: {
      polyfill: false,
      resolveDependencies: (filename, deps) => {
        return deps.filter(dep => !dep.includes('node_modules'));
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("react/") || id.includes("react-dom/")) return "react-core";
            if (id.includes("scheduler")) return "react-core";
            if (id.includes("@radix-ui/react-dialog") || id.includes("@radix-ui/react-dropdown")) return "radix-overlay";
            if (id.includes("@radix-ui/react-toast") || id.includes("@radix-ui/react-tooltip")) return "radix-feedback";
            if (id.includes("@radix-ui/react-select") || id.includes("@radix-ui/react-tabs")) return "radix-controls";
            if (id.includes("@radix-ui")) return "radix-base";
            if (id.includes("lucide-react")) return "icons";
            if (id.includes("framer-motion")) return "animation";
            if (id.includes("recharts") || id.includes("d3-")) return "charts";
            if (id.includes("jspdf")) return "pdf";
            if (id.includes("mammoth") || id.includes("docxtemplater") || id.includes("pizzip")) return "doc-parser";
            if (id.includes("@tanstack/react-query")) return "query";
            if (id.includes("wouter")) return "router";
            if (id.includes("zod") || id.includes("@hookform")) return "forms";
            return "vendor-misc";
          }
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
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === "production",
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug", "console.trace"],
        passes: 3,
        ecma: 2020,
        module: true,
        unsafe_arrows: true,
        unsafe_methods: true,
        unsafe_proto: true,
        keep_fargs: false,
      },
      mangle: { 
        toplevel: true,
        safari10: false,
      },
      format: { comments: false },
    },
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500,
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
    include: ["react", "react-dom/client", "wouter", "@tanstack/react-query"],
    exclude: ["@replit/vite-plugin-cartographer"],
    esbuildOptions: {
      target: "esnext",
      treeShaking: true,
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
              purgecss({
                content: [
                  "./client/index.html",
                  "./client/src/**/*.{js,jsx,ts,tsx}",
                  "./shared/**/*.{js,jsx,ts,tsx}",
                ],
                defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
                safelist: {
                  standard: [/^lucide-/, /^radix-/, /^data-/, /^aria-/],
                  deep: [/dark$/],
                  greedy: [/^Toaster/, /^Toast/, /^scroll-/, /^aspect-/],
                },
              }),
              cssnano({
                preset: [
                  "default",
                  {
                    discardComments: { removeAll: true },
                    normalizeWhitespace: true,
                    mergeLonghand: true,
                    mergeRules: true,
                    cssDeclarationSorter: true,
                  },
                ],
              }),
            ]
          : []),
      ],
    },
  },
});
