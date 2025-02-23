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
				logo: "var(--logo-clr)",

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
					"2light": "var(--gray-2light-clr)",
					"3light": "var(--gray-3light-clr)",
				},
				txtWhite: "var(--text-white)",

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
				r: "1px 0 2px var(--shadow-clr)", // Đổ bóng về bên phải
				l: "-1px 0 2px var(--shadow-clr)", // Đổ bóng về bên trái
				t: "0 -1px 2px var(--shadow-clr)", // Đổ bóng lên trên
				b: "0 1px 2px var(--shadow-clr)", // Đổ bóng xuống dưới
				y: "0px -1px 2px var(--shadow-clr), 0 1px 2px var(--shadow-clr)",
			},

			transitionProperty: {
				DEFAULT: "all", // Mặc định tất cả thuộc tính đều có hiệu ứng transition
			},
			transitionDuration: {
				DEFAULT: "120ms", // Mặc định 0.12s
			},
			transitionTimingFunction: {
				DEFAULT: "ease-out", // Mặc định ease-out
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};
