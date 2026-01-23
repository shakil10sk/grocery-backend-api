import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/marketplace/main.jsx',
                'resources/js/admin/main.jsx',
            ],
            refresh: true,
        }),
        react({
            include: /\.[jt]sx?$/,
            exclude: /node_modules/,
            jsxRuntime: 'automatic',
            fastRefresh: true,
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: undefined,
            },
        },
    },
    server: {
        hmr: {
            host: 'localhost',
            port: 5173,
        },
    },
});

