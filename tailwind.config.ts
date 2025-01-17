import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ['"Inter"', ...defaultTheme.fontFamily.sans],
				pona: ['"Fairfax Pona HD"', ...defaultTheme.fontFamily.sans],
				display: ['"SFRounded"', ...defaultTheme.fontFamily.sans]
			}
		}
	},

	plugins: [
		plugin(({ addVariant }) => {
			addVariant('hf', ['&:hover', '&:focus']);
			addVariant('hv', ['&:hover', '&:focus-visible']);
			addVariant('group-hf', ['.group:hover &', '.group:focus &']);
			addVariant('group-hv', ['.group:hover &', '.group:focus-visible &']);
		}),
		plugin(({ matchUtilities, theme }) => {
			matchUtilities(
				{
					'grid-cols-fill': (size) => ({
						gridTemplateColumns: `repeat(auto-fill, minmax(${size}, 1fr))`
					})
				},
				{ values: theme('width') }
			);
		})
	]
} satisfies Config;
