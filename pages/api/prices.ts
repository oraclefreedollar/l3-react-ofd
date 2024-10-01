import type { NextApiRequest, NextApiResponse } from "next";
import { Address } from "viem";
import { clientCoingecko } from "../../app.config";
import { ERC20Info, PositionQuery } from "../../redux/slices/positions.types";
import { PriceQuery, PriceQueryCurrencies, PriceQueryObjectArray } from "../../redux/slices/prices.types";
import { uniqueValues } from "../../utils/format-array";
import { fetchPositions } from "./positions";

// forced init caching of ERC20Infos
// solves development mode caching issue with coingecko free plan
let fetchedPositions: PositionQuery[] = [];
let fetchedAddresses: Address[] = [
	"0x55899A4Cd6D255DCcAA84d67E3A08043F2123d7E", //OFD
	"0x55d398326f99059fF775485246999027B3197955", //BSC-USD

	"0x9c06B95640455ae3DEc830A0a05370d4Cd6fFef8", //test OFD
	"0x887C14bc51705Eb11E238631a24B4d6305a7B6BD", //test BSC-USD
];
let fetchedERC20Infos: ERC20Info[] = [
	{
		address: "0x55899A4Cd6D255DCcAA84d67E3A08043F2123d7E",
		name: "oracleFreeDollar",
		symbol: "OFD",
		decimals: 18,
	},
	{
		address: "0x55d398326f99059fF775485246999027B3197955",
		name: "Binance-Peg BSC-USD",
		symbol: "BSC-USD",
		decimals: 18,
	},

	//Test Tokens
	{
		address: "0x9c06B95640455ae3DEc830A0a05370d4Cd6fFef8",
		name: "oracleFreeDollar",
		symbol: "OFD",
		decimals: 18,
	},
	{
		address: "0x887C14bc51705Eb11E238631a24B4d6305a7B6BD",
		name: "Binance-Peg BSC-USD",
		symbol: "BSC-USD",
		decimals: 18,
	},
];
let fetchedPrices: PriceQueryObjectArray = {
	"0x55899A4Cd6D255DCcAA84d67E3A08043F2123d7E": {
		address: "0x55899A4Cd6D255DCcAA84d67E3A08043F2123d7E",
		name: "oracleFreeDollar",
		symbol: "OFD",
		decimals: 18,
		timestamp: 1716389270047,
		price: {
			usd: 1.0,
		},
	},
	"0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c": {
		address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
		name: "Wrapped BNB",
		symbol: "WBNB",
		decimals: 18,
		timestamp: 1716389270047,
		price: {
			usd: 560,
		},
	},
	"0x55d398326f99059fF775485246999027B3197955": {
		address: "0x55d398326f99059fF775485246999027B3197955",
		name: "Binance-Peg BSC-USD",
		symbol: "BSC-USD",
		decimals: 18,
		timestamp: 1716389270047,
		price: {
			usd: 1.0,
		},
	},
	//Test Token
	"0x9c06B95640455ae3DEc830A0a05370d4Cd6fFef8": {
		address: "0x9c06B95640455ae3DEc830A0a05370d4Cd6fFef8",
		name: "oracleFreeDollar",
		symbol: "OFD",
		decimals: 18,
		timestamp: 1716389270047,
		price: {
			usd: 1.0,
		},
	},
	"0x887C14bc51705Eb11E238631a24B4d6305a7B6BD": {
		address: "0x887C14bc51705Eb11E238631a24B4d6305a7B6BD",
		name: "Binance-Peg BSC-USD",
		symbol: "BSC-USD",
		decimals: 18,
		timestamp: 1716389270047,
		price: {
			usd: 1.0,
		},
	},
};



type updateDetailsResponse = {
	prices: PriceQueryObjectArray;
	addresses: Address[];
	infos: ERC20Info[];
};

export async function updateDetails(): Promise<updateDetailsResponse> {
	const tmp = await fetchPositions();

	if (tmp.length == 0)
		return {
			prices: fetchedPrices,
			addresses: fetchedAddresses,
			infos: fetchedERC20Infos,
		};
	fetchedPositions = tmp;

	const collateralAddresses = fetchedPositions.map((position) => position.collateral).filter(uniqueValues);
	const mintAddress = fetchedPositions.at(-1)!.ofd;
	fetchedAddresses = [mintAddress, ...collateralAddresses];

	const erc20infos = [
		{
			address: fetchedPositions.at(-1)!.ofd,
			name: fetchedPositions.at(-1)!.ofdName,
			symbol: fetchedPositions.at(-1)!.ofdSymbol,
			decimals: fetchedPositions.at(-1)!.ofdDecimals,
		},
	];

	for (let addr of fetchedAddresses) {
		const data = fetchedPositions.find((p) => p.collateral == addr);
		if (data)
			erc20infos.push({
				address: addr,
				name: data.collateralName,
				symbol: data.collateralSymbol,
				decimals: data.collateralDecimals,
			});
	}
	fetchedERC20Infos = erc20infos;

	const fetchSourcesCoingecko = async function (contracts: Address[]) {
		const url = (addr: Address) => `/api/v3/simple/token_price/ethereum?contract_addresses=${addr}&vs_currencies=usd`;
		return contracts.map(async (c) => await clientCoingecko(url(c)));
	};

	// fetch from coingecko
	const data = await Promise.allSettled(await fetchSourcesCoingecko(fetchedAddresses));
	const prices: { [key: Address]: PriceQuery } = {};

	for (let p of data) {
		if (p.status == "rejected" || p.value.status != 200) continue;

		const response = await p.value.json();

		const contract: Address = Object.keys(response).at(0) as Address;
		const price: PriceQueryCurrencies = response[contract];

		if (!contract || !price) continue;

		const erc = erc20infos.find((i) => i.address?.toLowerCase() == contract);

		if (!erc) continue;

		prices[contract] = {
			...erc,
			timestamp: Date.now(),
			price,
		};
	}

	fetchedPrices = { ...fetchedPrices, ...prices };

	return {
		prices: fetchedPrices,
		addresses: fetchedAddresses,
		infos: fetchedERC20Infos,
	};
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<updateDetailsResponse>) {
	if (fetchedPositions.length == 0) await updateDetails();
	res.status(200).json({
		prices: fetchedPrices,
		addresses: fetchedAddresses,
		infos: fetchedERC20Infos,
	});
}

updateDetails();
setInterval(updateDetails, 5 * 60 * 1000);

