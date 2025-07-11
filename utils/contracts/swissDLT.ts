import { formatCurrency } from 'utils'
import { THE_GRAPH_KEY } from 'app.config'

import { PriceQueryObjectArray } from 'meta/prices'
import { ERC20Info } from 'meta/positions'
import { Address } from 'viem'

// Sushiswap subgraph endpoint (for Polygon)
const SUSHISWAP_SUBGRAPH_URL = `https://gateway.thegraph.com/api/${THE_GRAPH_KEY}/subgraphs/id/G1Q6dviDfMm6hVLvCqbfeB19kLmvs7qrnBvXeFndjhaU`

// GraphQL query to fetch BCTS/USDT pool reserves
const GET_BCTS_USDT_RESERVES = `
	query{
	  pool(id: "0xd47bcb3aa721153ac147e4d043ff43490452d17f") {
			token0 {
				symbol
				decimals
			}
			token1 {
				symbol
				decimals
			}
			volumeToken0
			volumeToken1
		}
	}
`

export const swissDLT = async (contract: Address, fetchedERC20Infos: Array<ERC20Info>, fetchedPrices: PriceQueryObjectArray) => {
	try {
		const contractToLowerCase = contract.toLowerCase()

		const response = await fetch(SUSHISWAP_SUBGRAPH_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ query: GET_BCTS_USDT_RESERVES }),
		})

		const data = await response.json()

		const pairData = data.data.pool
		const reserveBCTS = parseFloat(pairData.volumeToken0)
		const reserveUSDT = parseFloat(pairData.volumeToken1)

		// Calculate the price of BCTS in USDT
		const priceBCTSInUSDT = reserveBCTS / reserveUSDT

		const price = formatCurrency(String(priceBCTSInUSDT))
		const erc = fetchedERC20Infos.find((i) => i.address?.toLowerCase() == contractToLowerCase)

		if (!erc) return

		fetchedPrices[contractToLowerCase] = {
			...erc,
			timestamp: Date.now(),
			price: {
				usd: Number(price),
			},
		}
	} catch (e) {
		console.log(e)
	}
}
