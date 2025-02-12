import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta content="width=device-width, initial-scale=1" name="viewport" />
				<meta content="#111827" name="theme-color" />
				<link href="/favicon.ico" rel="icon" type="image/png" />
				<script
					dangerouslySetInnerHTML={{
						__html: `
							(function() {
								if (!window.chatbase || window.chatbase("getState") !== "initialized") {
									window.chatbase = (...args) => {
										if (!window.chatbase.q) {
											window.chatbase.q = [];
										}
										window.chatbase.q.push(args);
									};
									window.chatbase = new Proxy(window.chatbase, {
										get(target, prop) {
											if (prop === "q") {
												return target.q;
											}
											return (...args) => target(prop, ...args);
										}
									});
								}
								const onLoad = function() {
									const script = document.createElement("script");
									script.src = "https://chat.thechatmaster.com/embed.min.js";
									script.id = "p-piDC_1nlje7iCVWfFqa";
									script.domain = "chat.thechatmaster.com";
									document.body.appendChild(script);
								};
								if (document.readyState === "complete") {
									onLoad();
								} else {
									window.addEventListener("load", onLoad);
								}
							})();
						`,
					}}
				/>
			</Head>
			<body className="font-sans bg-synthwave bg-cover bg-center bg-no-repeat bg-fixed backdrop-blur-md min-h-screen">
				<div className="fixed inset-0 bg-black/10 -z-10"></div>
				<div className="relative w-full">
					<div className="mx-auto px-0 md:px-8">
						<Main />
						<NextScript />
					</div>
				</div>
			</body>
		</Html>
	)
}
