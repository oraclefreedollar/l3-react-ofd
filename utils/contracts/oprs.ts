import { formatCurrency } from 'utils'

import { PriceQueryObjectArray } from 'meta/prices'
import { ERC20Info } from 'meta/positions'

export const oprs = async (fetchedERC20Infos: Array<ERC20Info>, fetchedPrices: PriceQueryObjectArray) => {
	const contract = '0x8f73610Dd60185189657c826Df315Cc980ca4A0e'.toLowerCase()
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
	const erc = fetchedERC20Infos.find((i) => i.address?.toLowerCase() == contract)

	if (!erc) return

	fetchedPrices[contract] = {
		...erc,
		timestamp: Date.now(),
		price: {
			usd: Number(price),
		},
	}
}
