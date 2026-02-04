/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                primary: '#1E3A8A', // GCS Blue
                secondary: '#FFA500', // GCS Orange
                accent: '#10B981', // GCS Green
            },
            fontFamily: {
                sans: ['"Noto Sans KR"', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
