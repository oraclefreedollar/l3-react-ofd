import { Html, Head, Main, NextScript } from "next/document";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function Document() {
	return (
		<Html lang="en">
			<Head></Head>
			<body className="font-sans px-0 md:px-8 max-w-screen-2xl container-xl mx-auto bg-gray-900 text-slate-400">
				<Main />
				<NextScript />
				<Analytics />
				<SpeedInsights />
			</body>
		</Html>
	);
}
