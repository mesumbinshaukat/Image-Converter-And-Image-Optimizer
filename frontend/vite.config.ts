import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, '../', '')

    return {
        plugins: [react()],
        envDir: '../', // Point to the root directory where .env is located
        build: {
            outDir: '../',
            emptyOutDir: false,
        },
        server: {
            port: 3000,
            proxy: {
                '/api': {
                    target: env.VITE_API_BASE_URL || 'https://imgify.worldoftech.company/',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, '/backend/public/index.php/api')
                }
            }
        }
    }
})
