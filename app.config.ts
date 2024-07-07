"use client";

import { ApolloClient, InMemoryCache } from "@apollo/client";
import { bsc, bscTestnet } from "viem/chains";
import { envConfig } from "./app.env.config";

// URIs
export const URI_APP_LOCALHOST = "http://localhost:3000";
export const URI_APP_MAINNET = "https://app.frankencoin.com";
export const URI_APP_MAINDEV = "https://devapp.frankencoin.com";
export const URI_APP_DEVELOPER = "https://dapp.frankencoin.domain.com";

export const URI_PONDER_LOCALHOST = "http://localhost:42069";
export const URI_PONDER_MAINNET = "https://mainnetponder.frankencoin.com";
export const URI_PONDER_MAINDEV = "https://maindevponder.frankencoin.com";
export const URI_PONDER_DEVELOPER = "https://ponder.frankencoin.3dotshub.com";

// >>>>>> SELECTED URI HERE <<<<<<
export const URI_APP_SELECTED = envConfig.URI_APP_SELECTED;
export const URI_PONDER_SELECTED = envConfig.URI_PONDER_DEVELOPER;
// >>>>>> SELECTED URI HERE <<<<<<

// API KEYS
// FIXME: move to env or white list domain
export const COINGECKO_API_KEY = envConfig.COINGECKO_API_KEY; // demo key @samclassix

// WAGMI CONFIG
// FIXME: move to env or white list domain
export const WAGMI_PROJECT_ID = envConfig.WAGMI_PROJECT_ID;
export const WAGMI_CHAINS = [bsc, bscTestnet];
export const WAGMI_METADATA = {
	name: "OracleFreeDollar",
	description: "OracleFreeDollar Frontend Application",
	url: "https://l3-react-ofd.vercel.app/",
	icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// PONDER CLIENT
export const clientPonder = new ApolloClient({
	uri: "https://ofd-ponder-production-8631.up.railway.app/", //mainnet uri
	// uri: "https://ofd-ponder-testnet-production-b615.up.railway.app/", //testnet uri
	cache: new InMemoryCache(),
});

// COINGECKO CLIENT
export const clientCoingecko = (query: string) => {
	const hasParams = query.includes("?");
	const uri: string = `https://api.coingecko.com${query}`;
	return fetch(hasParams ? `${uri}&${COINGECKO_API_KEY}` : `${uri}?${COINGECKO_API_KEY}`);
};
