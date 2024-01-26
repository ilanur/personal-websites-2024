/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				"nunito": ['Nunito Sans', 'sans-serif'],
				"inter": ['Inter', 'sans-serif'] 
			},
			colors: {
				'eui-blue': '#004676',
			},			
		}
		
	},

	daisyui: {
		themes: ["light"],
	},

	plugins: []
};
