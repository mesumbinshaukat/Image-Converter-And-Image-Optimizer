// Production Vite configuration for Imgify
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    // Base URL for production deployment (adjust if served from a subdirectory)
    base: '/',
    // No dev server proxy needed in production; API calls go directly to the live backend
    // If you need a proxy for specific cases, configure here.
    server: {
        // Disable strict port binding for production builds
        strictPort: false,
    },
    // Build options can be tuned for production
    build: {
        outDir: 'dist',
        sourcemap: false,
        minify: 'esbuild',
    },
});
