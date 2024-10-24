import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta content="width=device-width, initial-scale=1" name="viewport" />
				<meta content="#111827" name="theme-color" />
				<link href="/favicon.ico" rel="icon" type="image/png" />
			</Head>
			<body className="font-sans bg-synthwave bg-cover bg-center bg-no-repeat bg-fixed backdrop-blur-md min-h-screen">
			<div className="fixed inset-0 bg-black/10 -z-10"></div>
			<div className="relative w-full">
				<div className="mx-auto px-0 md:px-8 max-w-screen-2xl">
					<Main />
					<NextScript />
				</div>
			</div>
			</body>
		</Html>
	)
}
