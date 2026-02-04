import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    branding: {
        logo: '',
        colors: {
            primary: '#1E3A8A',
            secondary: '#FFA500'
        }
    },
    integrations: [tailwind(), react()],
    output: 'static',
    site: 'https://seraph0153.github.io',
    base: '/gcs-website-v2',
    build: {
        format: 'file'
    }
});
