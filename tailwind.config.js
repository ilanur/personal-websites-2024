/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		container: {
			center: true,
			padding: '1rem'
		},
		colors: {
			'eui-blue': '#0A3253',
			'eui-red': '#A34D3A',
			'eui-yellow': '#F0C16F',
			'eui-gray': {
				DEFAULT: '#EEF3F9',
				10: '#F4F4F4',
				30: '#D9D9D9',
				70: '#54595E',
				90: '#131516'
			},
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
