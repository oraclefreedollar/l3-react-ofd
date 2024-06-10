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
	"0x55899A4Cd6D255DCcAA84d67E3A08043F2123d7E", //changed
	"0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c", //changed
	"0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47", //changed
	"0x7a915393E5eD3a18ADb5a96B53070E31023CbeD1", //changed
	"0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", //changed
	"0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", //changed
	"0xb1547683DA678f2e1F003A780143EC10Af8a832B", //changed
];
let fetchedERC20Infos: ERC20Info[] = [
	{
		address: "0x55899A4Cd6D255DCcAA84d67E3A08043F2123d7E",
		name: "Frankencoin",
		symbol: "ZCHF",
		decimals: 18,
	},
	{
		// address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
		address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c", //changed
		name: "Wrapped BTC",
		symbol: "WBTC",
		decimals: 8,
	},
	{
		// address: "0x8747a3114Ef7f0eEBd3eB337F745E31dBF81a952"
		address: "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47", //changed
		name: "Cardano", //change to Binance-Peg Cardano Token
		symbol: "ADA", //change to ADA
		decimals: 0,
	},
	{
		address: "0xeA38b0cD48fA781181FDAa37291e8d6668462261",
		name: "Frankencoin Pool Share",
		symbol: "FPS",
		decimals: 18,
	},
	{
		// address: "0x8c1BEd5b9a0928467c9B1341Da1D7BD5e10b6549",
		address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
		name: "PancakeSwap",
		symbol: "CAKE", //Change to CAKE
		decimals: 18,
	},
	{
		// address: "0x553C7f9C780316FC1D34b8e14ac2465Ab22a090B",
		address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
		name: "USDC",
		symbol: "USDC",
		decimals: 0,
	},
	{
		// address: "0x2E880962A9609aA3eab4DEF919FE9E917E99073B",
		address: "0xb1547683DA678f2e1F003A780143EC10Af8a832B",
		name: "Shiba Inu", //change to Boss Token
		symbol: "SHIB",
		decimals: 18,
	},
];
let fetchedPrices: PriceQueryObjectArray = {
	"0xb58e61c3098d85632df34eecfb899a1ed80921cb": {
		address: "0xB58E61C3098d85632Df34EecfB899A1Ed80921cB",
		name: "Frankencoin",
		symbol: "ZCHF",
		decimals: 18,
		timestamp: 1716389270047,
		price: {
			usd: 1.0,
		},
	},
	"0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c": {
		address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
		name: "Wrapped BTC",
		symbol: "WBTC",
		decimals: 8,
		timestamp: 1716389270047,
		price: {
			usd: 69942,
		},
	},
	"0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47": {
		address: "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47",
		name: "Cardano",
		symbol: "ADA", //ADA
		decimals: 18,
		timestamp: 1716389270047,
		price: {
			usd: 0.4442,
		},
	},
	"0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82": {
		address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
		name: "PancakeSwap",
		symbol: "CAKE", //CAKE
		decimals: 18,
		timestamp: 1716389270047,
		price: {
			usd: 2.6922,
		},
	},
	"0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d": {
		address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
		name: "USDC",
		symbol: "USDC",
		decimals: 18,
		timestamp: 1716389270047,
		price: {
			usd: 1.0,
		},
	},
	"0xb1547683DA678f2e1F003A780143EC10Af8a832B": {
		address: "0xb1547683DA678f2e1F003A780143EC10Af8a832B",
		name: "Shiba Inu",
		symbol: "SHIB",
		decimals: 18,
		timestamp: 1716389270047,
		price: {
			usd: 0.00002298,
		},
	},
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<updateDetailsResponse>) {
	if (fetchedPositions.length == 0) await updateDetails();
	res.status(200).json({
		prices: fetchedPrices,
		addresses: fetchedAddresses,
		infos: fetchedERC20Infos,
	});
}

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
	const mintAddress = fetchedPositions.at(-1)!.zchf;
	fetchedAddresses = [mintAddress, ...collateralAddresses];

	const erc20infos = [
		{
			address: fetchedPositions.at(-1)!.zchf,
			name: fetchedPositions.at(-1)!.zchfName,
			symbol: fetchedPositions.at(-1)!.zchfSymbol,
			decimals: fetchedPositions.at(-1)!.zchfDecimals,
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
		if (p.status == "rejected") continue;
		if (p.value.status != 200) continue;

		const response = await p.value.json();

		const contract: Address = Object.keys(response).at(0) as Address;
		if (!contract) continue;

		const price: PriceQueryCurrencies = contract ? response[contract] : null;
		if (!price) continue;

		const erc = erc20infos.find((i) => i.address.toLowerCase() == contract);
		if (!erc) continue;

		const timestamp = Date.now();

		prices[contract] = {
			...erc,
			timestamp,
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

updateDetails();
setInterval(updateDetails, 5 * 60 * 1000);
