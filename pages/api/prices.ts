import type { NextApiRequest, NextApiResponse } from 'next'
import { Address } from 'viem'
import { clientCoingecko, WAGMI_CHAIN } from 'app.config'
import { uniqueValues } from 'utils/format-array'
import { fetchPositions } from 'pages/api/positions'
import { Contracts } from 'utils'
import { bsc, bscTestnet, mainnet } from 'viem/chains'
import { ADDRESS } from 'contracts'

import { PriceQueryObjectArray, PriceQueryCurrencies } from 'meta/prices'
import { ERC20Info, PositionQuery } from 'meta/positions'

// forced init caching of ERC20Infos
// solves development mode caching issue with coingecko free plan
let fetchedPositions: PositionQuery[] = []
let fetchedAddresses: Address[] = [
	ADDRESS[bscTestnet.id].oracleFreeDollar, //test OFD
	ADDRESS[bscTestnet.id].usdt, //test BSC-USD
]
let fetchedERC20Infos: ERC20Info[] = [
	{
		address: ADDRESS[bscTestnet.id].oracleFreeDollar,
		name: 'OracleFreeDollar Test',
		symbol: 'OFD',
		decimals: 18,
	},
	{
		address: ADDRESS[bscTestnet.id].usdt,
		name: 'Binance-Peg BSC-USD Test',
		symbol: 'BSC-USD',
		decimals: 18,
	},
]
const fetchedPrices: PriceQueryObjectArray = {
	[ADDRESS[mainnet.id].oracleFreeDollar]: {
		address: ADDRESS[mainnet.id].oracleFreeDollar,
		name: 'OracleFreeDollar',
		symbol: 'OFD',
		decimals: 18,
		timestamp: 1716389270047,
		price: {
			usd: 1.0,
		},
	},
	[ADDRESS[bsc.id].oracleFreeDollar]: {
		address: ADDRESS[bsc.id].oracleFreeDollar,
		name: 'OracleFreeDollar',
		symbol: 'OFD',
		decimals: 18,
		timestamp: 1716389270047,
		price: {
			usd: 1.0,
		},
	},
	//Test Token
	[ADDRESS[bscTestnet.id].oracleFreeDollar]: {
		address: ADDRESS[bscTestnet.id].oracleFreeDollar,
		name: 'OracleFreeDollar Test',
		symbol: 'OFD',
		decimals: 18,
		timestamp: 1716389270047,
		price: {
			usd: 1.0,
		},
	},
	[ADDRESS[bscTestnet.id].usdt]: {
		address: ADDRESS[bscTestnet.id].usdt,
		name: 'Binance-Peg BSC-USD Test',
		symbol: 'BSC-USD',
		decimals: 18,
		timestamp: 1716389270047,
		price: {
			usd: 1.0,
		},
	},
}

type updateDetailsResponse = {
	prices: PriceQueryObjectArray
	addresses: Address[]
	infos: ERC20Info[]
}

type FetchFunction = () => Promise<void>

export const fetchExternalPrices: Record<Address, FetchFunction> = {
	'0xd9B8CF9f4FD8055c0454389dD6aAB1FDcE2E8781': () => Contracts.Prices.dgc(fetchedERC20Infos, fetchedPrices), // Denario Gold Coin
	'0x2F30D9EC8Fec8612DBCD54C4C2604Ffc972E8a8d': () => Contracts.Prices.dsc(fetchedERC20Infos, fetchedPrices), // Denario Silver Coin
	'0x8f73610Dd60185189657c826Df315Cc980ca4A0e': () => Contracts.Prices.oprs(fetchedERC20Infos, fetchedPrices), // Operal
	'0x09A1aD50Ac7B8ddD40bAfa819847Ab1Ea6974a4f': () => Contracts.Prices.swissDLT(fetchedERC20Infos, fetchedPrices), // SwissDLT
}

type Props = { chainId: number }

export async function updateDetails(props: Props): Promise<updateDetailsResponse> {
	const { chainId } = props

	const tmp = await fetchPositions({ chainId })

	if (tmp.length === 0)
		return {
			prices: fetchedPrices,
			addresses: fetchedAddresses,
			infos: fetchedERC20Infos,
		}
	fetchedPositions = tmp

	const collateralAddresses = fetchedPositions.map((position) => position.collateral).filter(uniqueValues)
	const mintAddress = fetchedPositions.at(-1)!.ofd
	fetchedAddresses = [mintAddress, ...collateralAddresses]

	fetchedERC20Infos = [
		{
			address: fetchedPositions.at(-1)!.ofd,
			name: fetchedPositions.at(-1)!.ofdName,
			symbol: fetchedPositions.at(-1)!.ofdSymbol,
			decimals: fetchedPositions.at(-1)!.ofdDecimals,
		},
	]

	for (const addr of fetchedAddresses) {
		const data = fetchedPositions.find((p) => p.collateral == addr)
		if (data)
			fetchedERC20Infos.push({
				address: addr,
				name: data.collateralName,
				symbol: data.collateralSymbol,
				decimals: data.collateralDecimals,
			})
	}

	const fetchCoinGecko = async function (originalContract: Address): Promise<void> {
		const contract = Contracts.Constants.toBridgedContract[originalContract] ?? originalContract
		const platform = Contracts.Constants.coingeckoPlatforms[contract] ?? 'binance-smart-chain'

		const url = (addr: Address) => `/api/v3/simple/token_price/${platform}?contract_addresses=${addr}&vs_currencies=usd`
		const data = await clientCoingecko(url(contract))

		if (data.status !== 200) return

		const response = await data.json()
		const price: PriceQueryCurrencies = response[contract.toLowerCase()]

		if (!contract || !price) return
		const erc = fetchedERC20Infos.find((i) => i.address?.toLowerCase() == originalContract.toLowerCase())

		if (!erc) return

		fetchedPrices[originalContract.toLowerCase()] = {
			...erc,
			timestamp: Date.now(),
			price,
		}
		return Promise.resolve()
	}

	// MAINNET ONLY: fetch prices from external resources
	if (WAGMI_CHAIN !== bscTestnet) {
		await Promise.allSettled(
			fetchedAddresses.map(async (c) => fetchExternalPrices[c]?.() ?? (await fetchCoinGecko(c.toLowerCase() as Address)))
		)
	}

	return {
		prices: fetchedPrices,
		addresses: fetchedAddresses,
		infos: fetchedERC20Infos,
	}
}

export default async function handler(props: NextApiRequest, res: NextApiResponse<updateDetailsResponse>) {
	const chainId = parseInt(props.query.chainId as string)

	await updateDetails({ chainId })
	res.status(200).json({
		prices: fetchedPrices,
		addresses: fetchedAddresses,
		infos: fetchedERC20Infos,
	})
}

//updateDetails();
//setInterval(updateDetails, 5 * 60 * 1000);
