/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				pink: {
					DEFAULT: '#e0296a',
				},
				white: {
					DEFAULT: '#fff6e1',
					light: '#ccc2b0',
				},
				black: {
					DEFAULT: '#0a0a0a',
				}
			},
			fontFamily: {
				'sans': ['"Open Sans"',  ...defaultTheme.fontFamily.sans],
				'serif': ['"Ostrich Sans"', ...defaultTheme.fontFamily.serif],
			}
		}
	},
	plugins: []
}
