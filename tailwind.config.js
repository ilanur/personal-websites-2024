/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			container: {
				padding: {
					DEFAULT: '1.5rem',
					sm: '2rem',
					lg: '4rem',
					xl: '5rem',
					'2xl': '6rem'
				},
				center: true
			},
			fontFamily: {
				nunito: ['Nunito Sans', 'sans-serif'],
				inter: ['Inter', 'sans-serif']
			},
			fontSize: {
				xs: '0.6rem',
				sm: '0.69rem',
				tiny: '0.83rem',
				base: '1rem',
				lg: '1.2rem',
				xl: '1.44rem',
				'2xl': '1.73rem',
				'3xl': '2.07rem',
				'4xl': '2.49rem',
				'5xl': '2.99rem',
				'6xl': '3.58rem',
				'7xl': '4.3rem'
			},
			colors: {
				'eui-dark-blue': {
					50: '#51A4EA',
					100: '#3F9AE8',
					200: '#1B87E3',
					300: '#1771BF',
					400: '#125C9A',
					500: '#0E4676',
					600: '#082844',
					700: '#020B12',
					800: '#000000',
					900: '#000000',
					950: '#000000'
				},
				'eui-light-blue': {
					50: '#B0D5F0',
					100: '#9FCCED',
					200: '#7DBAE6',
					300: '#5BA8E0',
					400: '#3896D9',
					500: '#2581C4',
					600: '#1C6295',
					700: '#134366',
					800: '#0A2436',
					900: '#010507',
					950: '#000000'
				},
				'eui-sand': {
					50: '#EBE4DF',
					100: '#E3D9D2',
					200: '#D4C3B9',
					300: '#C4AEA0',
					400: '#AF907D',
					500: '#96745D',
					600: '#745948',
					700: '#513E32',
					800: '#2F241D',
					900: '#0C0907',
					950: '#000000'
				},
				'intranet-blue': {
					50: '#f0f7ff',
					100: '#e0eefe',
					200: '#bbddfc',
					300: '#7fc1fa',
					400: '#3aa2f6',
					500: '#1187e6',
					600: '#0469c5',
					700: '#0555a2',
					800: '#094883',
					900: '#0d3d6d',
					950: '#092648'
				},
				'intranet-red': {
					50: '#fff0fa',
					100: '#ffe4f6',
					200: '#ffc9ef',
					300: '#ff9de1',
					400: '#ff60ca',
					500: '#ff31b2',
					600: '#f50d90',
					700: '#d60073',
					800: '#b0045e',
					900: '#950952',
					950: '#5a002d'
				},
				'intranet-gray': {
					50: '#f8fafc',
					100: '#e9eff5',
					200: '#cedde9',
					300: '#a3c1d6',
					400: '#729fbe',
					500: '#5083a7',
					600: '#3d698c',
					700: '#325572',
					800: '#2d495f',
					900: '#293e51',
					950: '#1b2836'
				},
				'intranet-beige': {
					50: '#f4f4f2',
					100: '#e3e2de',
					200: '#c9c6bf',
					300: '#aaa49a',
					400: '#91897e',
					500: '#837a6f',
					600: '#70665e',
					700: '#58504b',
					800: '#4f4844',
					900: '#463f3d',
					950: '#272321'
				},
				'intranet-black': {
					50: '#f6f7f9',
					100: '#edeef1',
					200: '#d6dae1',
					300: '#b3bbc6',
					400: '#8a97a6',
					500: '#6b798c',
					600: '#566173',
					700: '#464f5e',
					800: '#3d444f',
					900: '#363b44',
					950: '#2c3038'
				}
			},
			aspectRatio: {
				'2-1': '2 / 1',
				'2-3': '2 / 3',
				'4-3': '4 / 3',
				'3-4': '3 / 4',
				'16-9': '16 / 9',
				'21-9': '21 / 9',
				'9-16': '9 / 16'
			},
			listStyleType: {
				square: 'square'
			},
			screens: {
				'3xl': '1800px'
			},
			animation: {
				blob: 'blob 7s infinite'
			},
			keyframes: {
				blob: {
					'0%': { transform: 'translate(0px, 0px) scale(1)' },
					'33%': { transform: 'translate(30px, -50px) scale(1.1)' },
					'66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
					'100%': { transform: 'tranlate(0px, 0px) scale(1)' }
				}
			}
		}
	},
	plugins: [require('@tailwindcss/forms')]
}
