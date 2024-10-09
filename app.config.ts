"use client";

import { ApolloClient, InMemoryCache } from "@apollo/client";
import { bsc, bscTestnet } from "viem/chains";
import { envConfig } from "./app.env.config";
import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { coinbaseWallet, injected, walletConnect } from "@wagmi/connectors";

// >>>>>> SELECTED URI HERE <<<<<<
export const URI_APP_SELECTED = envConfig.URI_APP_SELECTED;
export const URI_PONDER_SELECTED = envConfig.URI_PONDER_DEVELOPER;
export const RPC_URL_MAINNET = envConfig.RPC_URL_MAINNET;
export const RPC_URL_TESTNET = envConfig.RPC_URL_TESTNET;
// >>>>>> SELECTED URI HERE <<<<<<

// API KEYS
// FIXME: move to env or white list domain
export const COINGECKO_API_KEY = envConfig.COINGECKO_API_KEY;

export const THE_GRAPH_KEY = envConfig.THE_GRAPH_KEY;

// WAGMI CONFIG
// FIXME: move to env or white list domain
export const WAGMI_PROJECT_ID = envConfig.WAGMI_PROJECT_ID;

export const WAGMI_CHAIN = envConfig.ENV === ("dev" || "local") ? bscTestnet : bsc;

export const WAGMI_METADATA = {
	name: "OracleFreeDollar",
	description: "OracleFreeDollar Frontend Application",
	url: "https://app.oraclefreedollar.org/",
	icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

export const WAGMI_CONFIG = createConfig({
	chains: [WAGMI_CHAIN],
	transports: {
		[bsc.id]: http(RPC_URL_MAINNET),
		[bscTestnet.id]: http(RPC_URL_TESTNET),
	},
	batch: {
		multicall: {
			wait: 200,
		},
	},
	connectors: [
		walletConnect({ projectId: WAGMI_PROJECT_ID, metadata: WAGMI_METADATA, showQrModal: false }),
		injected({ shimDisconnect: true }),
		coinbaseWallet({
			appName: WAGMI_METADATA.name,
			appLogoUrl: WAGMI_METADATA.icons[0],
		}),
	],
	ssr: true,
	storage: createStorage({
		storage: cookieStorage,
	}),
});

// PONDER CLIENT
export const clientPonder = new ApolloClient({
	uri: URI_PONDER_SELECTED,
	cache: new InMemoryCache(),
});

// COINGECKO CLIENT
export const clientCoingecko = (query: string) => {
	const uri: string = `https://api.coingecko.com${query}`;
	const options = {
		method: 'GET',
		headers: {accept: 'application/json', 'x-cg-demo-api-key': COINGECKO_API_KEY}
	}
	return fetch(uri, options);
};
