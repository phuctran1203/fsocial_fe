/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			container: {
				center: true,
			},

			colors: {
				primary: {
					DEFAULT: "var(--primary-clr)",
					hover: "var(--primary-hover-clr)",
					active: "var(--primary-active-clr)",
					ghost: "var(--primary-ghost-clr)",
					text: "var(--text-primary-clr)",
				},

				secondary: {
					DEFAULT: "var(--secondary-clr)",
					hover: "var(--secondary-hover-clr)",
					active: "var(--secondary-active-clr)",
					text: "var(--text-secondary-clr)",
				},

				background: {
					DEFAULT: "var(--background-clr)",
					lower: "var(--lower-background-clr)",
				},

				gray: {
					DEFAULT: "var(--gray-clr)",
					light: "var(--gray-light-clr)",
					"2light": "var(--gray-extra-light-clr)",
					"3light": "var(--gray-extraaa-light-clr)",
				},

				// chart: {
				// 	1: "hsl(var(--chart-1))",
				// 	2: "hsl(var(--chart-2))",
				// 	3: "hsl(var(--chart-3))",
				// 	4: "hsl(var(--chart-4))",
				// 	5: "hsl(var(--chart-5))",
				// },
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};
