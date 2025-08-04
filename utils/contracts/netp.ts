import { formatCurrency } from 'utils'
import { THE_GRAPH_KEY } from 'app.config'

import { PriceQueryObjectArray } from 'meta/prices'
import { ERC20Info } from 'meta/positions'
import { Address } from 'viem'

// Uniswap subgraph endpoint (for Polygon)
const UNISWAP_SUBGRAPH_URL = `https://gateway.thegraph.com/api/${THE_GRAPH_KEY}/subgraphs/id/CwpebM66AH5uqS5sreKij8yEkkPcHvmyEs7EwFtdM5ND`

// GraphQL query to fetch NETP/OFD pool reserves
const GET_NETP_PRICE = `
	query{
		pool(id: "0x478f207244bac07b5219e63055fd6f61f2905346f90e9df70bb3b8648305c39c") {
			token1Price
		}
	}
`

export const netp = async (contract: Address, fetchedERC20Infos: Array<ERC20Info>, fetchedPrices: PriceQueryObjectArray) => {
	try {
		const contractToLowerCase = contract.toLowerCase()

		const response = await fetch(UNISWAP_SUBGRAPH_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ query: GET_NETP_PRICE }),
		})

		const data = await response.json()

		const pairData = data.data.pool
		const netpPrice = parseFloat(pairData.token1Price)

		const price = formatCurrency(String(netpPrice))
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
