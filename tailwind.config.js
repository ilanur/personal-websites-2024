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
				'2/1': '2 / 1',
				'2/3': '2 / 3',
				'4/3': '4 / 3',
				'16/9': '16 / 9',
				'21/9': '21 / 9'
			},
		}
	},

	daisyui: {
		themes: ['light']
	},

	plugins: []
};
