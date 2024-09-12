import { NextSeo } from "next-seo";
import { envConfig } from "../app.env.config";

export default function NextSeoProvider() {
	return (
		<NextSeo
			title={envConfig.AppName}
			description={`The ${envConfig.AppName} is a decentralized lending and borrowing protocol on Binance Smart Chain. By eliminating oracles and offering on-chain governance, OFD enables users to collateralize tokenized real-world assets for transparent, secure loans. Join the future of decentralized finance and unlock liquidity without selling your assets.`}
			openGraph={{
				type: "website",
				locale: "en_US",
				url: "https://app.oracleFreeDollar.org/",
				siteName: envConfig.AppName,
				// images: [
				//   {
				//     url: "https://oracleFreeDollar.com//splash.png",
				//     width: 1670,
				//     height: 1158,
				//     alt: "landing page preview",
				//   },
				// ],
			}}
			additionalMetaTags={[
				{
					name: "keywords",
					content: "Oracle Free Dollar, OFD protocol, Decentralized finance (DeFi), Binance Smart Chain (BSC), On-chain governance, Tokenized real-world assets (RWA), Collateralized lending, Borrowing protocol, Stablecoins, Blockchain loans, Liquidity unlocking, Decentralized loans, DeFi governance, Oracle-free lending, Smart contracts, OFD staking"
				},
				{
					name: "viewport",
					content: "initial-scale=1.0, width=device-width",
				}
			]}
			twitter={{
				handle: "@OFD_BNB",
				site: "@OFD_BNB",
				cardType: "summary_large_image",
			}}
			themeColor="#111827"
			additionalLinkTags={[
				{
					rel: "icon",
					href: "/favicon.ico",
					type: "image/png",
				},
			]}
		/>
	);
}
