/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		container: {
			center: true
		},
		colors: {
			'eui-blue': '#004676',
			'eui-red': '#A34D3A',
			white: '#FFFFFF'
		},
		extend: {
			fontFamily: {
				nunito: ['Nunito Sans', 'sans-serif'],
				inter: ['Inter', 'sans-serif']
			},
			aspectRatio: {
				'2-1': '2 / 1',
				'2-3': '2 / 3',
				'4-3': '4 / 3',
				'16-9': '16 / 9',
				'21-9': '21 / 9'
			}
		}
	},
	plugins: [require('@tailwindcss/forms')]
};
