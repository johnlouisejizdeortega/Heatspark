import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
    // Bundle all dependencies into the SSR output so it runs standalone in
    // production containers where node_modules is not present at runtime.
    ssr: {
        noExternal: true,
    },
    build: {
        rollupOptions: {
            output: {
                // Keep font files with stable names (no hash) so blade can preload them
                assetFileNames: (assetInfo) => {
                    if (/\.(woff2?|ttf|eot)$/i.test(assetInfo.name ?? '')) {
                        return 'assets/fonts/[name][extname]';
                    }
                    return 'assets/[name]-[hash][extname]';
                },
            },
        },
    },
});
