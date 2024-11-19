/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'custom-red': '#e44d3a', // Định nghĩa màu tùy chỉnh
            },
        },
    },
    variants: {},
    plugins: [
        require('@tailwindcss/typography'),
    ],
}