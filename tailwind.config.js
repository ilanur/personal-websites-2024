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
			'eui-yellow': '#F0C16F',
			'eui-gray': '#EEF3F9',
			'eui-darker-gray': '#54595E',
			'eui-dark-gray': '#131516',
			white: '#FFFFFF'
		},
		extend: {
			fontFamily: {
				nunito: ['Nunito Sans', 'sans-serif'],
				montserrat: ['Montserrat', 'sans-serif']
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
	plugins: [require('@tailwindcss/forms')]
};
