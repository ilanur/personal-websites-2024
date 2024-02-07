/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				nunito: ['Nunito Sans', 'sans-serif'],
				inter: ['Inter', 'sans-serif']
			},
			colors: {
				'eui-blue': '#004676'
			},
			aspectRatio: {
				'2-1': '2 / 1',
				'2-3': '2 / 3',
				'4-3': '4 / 3',
				'16-9': '16 / 9',
				'21-9': '21 / 9'
			},
			fontSize: {
				h1: '2.5rem',
				h2: '2rem',
				h3: '1.75rem',
				h4: '1.5rem',
				h5: '1.25rem',
				h6: '1rem'
			}
		}
	},

	daisyui: {
		themes: ['light']
	},

	plugins: []
};
