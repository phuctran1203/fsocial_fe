/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			container: {
				center: true,
			},
			// fun
			backgroundImage: {
				"primary-gradient": "var(--primary-gradient-clr)",
			},
			colors: {
				logo: "var(--logo-clr)",
				primary: {
					DEFAULT: "var(--primary-clr)",
					hover: "var(--primary-hover-clr)",
					active: "var(--primary-active-clr)",
					ghost: "var(--primary-ghost-clr)",
					text: "var(--text-primary-clr)",
					// foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "var(--secondary-clr)",
					hover: "var(--secondary-hover-clr)",
					active: "var(--secondary-active-clr)",
					text: "var(--text-secondary-clr)",
					// foreground: "hsl(var(--secondary-foreground))",
				},

				background: {
					DEFAULT: "var(--background-clr)",
					lower: "var(--lower-background-clr)",
				},

				gray: {
					DEFAULT: "var(--gray-clr)",
					light: "var(--gray-light-clr)",
					"2light": "var(--gray-2light-clr)",
					"3light": "var(--gray-3light-clr)",
				},
				txtWhite: "var(--text-white)",
				chart: {
					orange: "var(--orange-chart-clr)",
					blue: "var(--blue-chart-clr)",
					green: "var(--green-chart-clr)",
				},

				foreground: "hsl(var(--foreground))",
				// card: {
				//   DEFAULT: "hsl(var(--card))",
				//   foreground: "hsl(var(--card-foreground))",
				// },
				// popover: {
				//   DEFAULT: "hsl(var(--popover))",
				//   foreground: "hsl(var(--popover-foreground))",
				// },
				muted: {
					DEFAULT: "var(--muted-clr)",
					foreground: "hsl(var(--muted-foreground))",
				},
				// accent: {
				// 	DEFAULT: "hsl(var(--accent))",
				// 	foreground: "hsl(var(--accent-foreground))",
				// },
				// destructive: {
				// 	DEFAULT: "hsl(var(--destructive))",
				// 	foreground: "hsl(var(--destructive-foreground))",
				// },
				// border: "hsl(var(--border))",
				// input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				// chart: {
				// 	1: "hsl(var(--chart-1))",
				// 	2: "hsl(var(--chart-2))",
				// 	3: "hsl(var(--chart-3))",
				// 	4: "hsl(var(--chart-4))",
				// 	5: "hsl(var(--chart-5))",
				// },
			},
			borderColor: {
				DEFAULT: "var(--border-clr)",
				hover: "var(--border-hover-clr)",
			},
			ringColor: {
				DEFAULT: "var(--border-clr)",
				hover: "var(--border-hover-clr)",
			},
			boxShadow: {
				DEFAULT: "0px 0 3px 0 var(--shadow-clr)",
				r: "1px 0 2px var(--shadow-clr)",
				l: "-1px 0 2px var(--shadow-clr)",
				t: "0 -1px 2px var(--shadow-clr)",
				b: "0 1px 2px var(--shadow-clr)",
				y: "0px -1px 2px var(--shadow-clr), 0 1px 2px var(--shadow-clr)",
			},
			transitionProperty: {
				DEFAULT: "all",
			},
			transitionDuration: {
				DEFAULT: "150ms",
			},
			transitionTimingFunction: {
				DEFAULT: "cubic-bezier(0.22, 0.16, 0.06, 0.93)",
			},
			// borderRadius: {
			// 	lg: "var(--radius)",
			// 	md: "calc(var(--radius) - 2px)",
			// 	sm: "calc(var(--radius) - 4px)",
			// },

			keyframes: {
				"caret-blink": {
					"0%,70%,100%": { opacity: "1" },
					"20%,50%": { opacity: "0" },
				},
			},
			animation: {
				"caret-blink": "caret-blink 1.25s ease-out infinite",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};
