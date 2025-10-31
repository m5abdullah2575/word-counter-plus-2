import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import viteImagemin from "vite-plugin-imagemin";

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
    },
  },

  root: r("client"),

  build: {
    outDir: r("dist/public"),
    emptyOutDir: true,
    target: "esnext",
    cssCodeSplit: false,
    sourcemap: false,
    rollupOptions: {
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
        passes: 2,
      },
      mangle: true,
      format: { comments: false },
    },
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
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
    include: ["react", "react/jsx-runtime", "react-dom/client", "wouter", "@tanstack/react-query"],
    exclude: ["@replit/vite-plugin-cartographer"],
    esbuildOptions: {
      target: "esnext",
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
