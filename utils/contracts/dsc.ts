import { formatCurrency } from 'utils'

import { PriceQueryObjectArray } from 'meta/prices'
import { ERC20Info } from 'meta/positions'
import { Address } from 'viem'

type DSCPRice = {
	priceAsk: string
	priceBid: string
	currency: string
	priceDate: string
}

export const dsc = async (contract: Address, fetchedERC20Infos: Array<ERC20Info>, fetchedPrices: PriceQueryObjectArray) => {
	const contractToLowerCase = contract.toLowerCase()

	const options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'X-AUTH-TOKEN': 'd91ad64f-4e7c-4f01-9dca-b264dd55e614',
		},
	}
	const data = await fetch('https://staging.price.denario.swiss/api/silvercoins/latest', options)
	const response = await data.json()
	const dscPriceUsd = response.find((o: DSCPRice) => o.currency === 'USD')
	const price = formatCurrency(String(dscPriceUsd?.priceAsk))
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
