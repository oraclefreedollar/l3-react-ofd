/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./node_modules/flowbite-react/lib/**/*.js"],
	safelist: [
		{
			pattern: /grid-cols-/,
			variants: ["sm", "md", "lg", "xl", "2xl"],
		},
	],
	theme: {
		fontFamily: {
			sans: ["Helvetica", "ui-sans-serif"],
		},
		extend: {
			height: {
				main: "calc(100vh)",
			},
			minHeight: {
				content: "calc(100vh - 230px)",
			},
			transitionProperty: {
				height: "height",
			},
			backgroundImage: {
				'synthwave': "url('/assets/synthwave_bg_big.jpg')",
			},
			colors: {
				layout: {
					primary: "#f0f9ff", // Light blue background
					secondary: "#fed7e2", // Light pink
				},
				card: {
					header: "#390a6a", // Teal
					primary: "#ffffff", // White
					secondary: "#fce7f3", // Very light pink
				},
				text: {
					header: "#0891b2", // Dark teal
					subheader: "#6b7280", // Gray
					primary: "#0e7490", // Darker teal
					secondary: "#0c4a6e", // Dark blue
				},
			},
		},
	},
	darkMode: "class",
	plugins: [require("flowbite/plugin")({ charts: true })],
};
