import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    site: 'https://panneaux-solaires-france-y62r.vercel.app/',
    integrations: [
        sitemap({
            changefreq: 'weekly',
            priority: 0.7,
            lastmod: new Date('2025-01-15'),
        }), [react()]
    ],
    output: 'static',
    compressHTML: true,
    build: {
        inlineStylesheets: 'auto',
    },
    vite: {
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: ['astro'],
                    },
                },
            },
        },
    },
    server: {
        headers: {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
    },
});