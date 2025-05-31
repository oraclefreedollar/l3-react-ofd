import { formatCurrency } from 'utils'

import { PriceQueryObjectArray } from 'meta/prices'
import { ERC20Info } from 'meta/positions'
import { Address } from 'viem'

export const oprs = async (contract: Address, fetchedERC20Infos: Array<ERC20Info>, fetchedPrices: PriceQueryObjectArray) => {
	const contractToLowerCase = contract.toLowerCase()

	const options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	}
	const data = await fetch('https://api.aktionariat.com/price?ticker=OPRS', options)
	const response = await data.json()
	// convert CHF to USD hardcoded
	// TODO: refactor using a proper currency conversion library
	const price = formatCurrency(String(response.price * 1.17))
	const erc = fetchedERC20Infos.find((i) => i.address?.toLowerCase() == contractToLowerCase)

	if (!erc) return

	fetchedPrices[contractToLowerCase] = {
		...erc,
		timestamp: Date.now(),
		price: {
			usd: Number(price),
		},
	}
}
