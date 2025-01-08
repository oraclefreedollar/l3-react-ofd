import { ERC20Info } from 'redux/slices/positions.types'
import { PriceQueryObjectArray } from 'redux/slices/prices.types'
import { formatCurrency } from 'utils'

export const dsc = async (fetchedERC20Infos: Array<ERC20Info>, fetchedPrices: PriceQueryObjectArray) => {
	const contract = '0x2f30d9ec8fec8612dbcd54c4c2604ffc972e8a8d'.toLowerCase()
	const options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'X-AUTH-TOKEN': 'd91ad64f-4e7c-4f01-9dca-b264dd55e614',
		},
	}
	const data = await fetch('https://staging.price.denario.swiss/api/silvercoins/latest', options)
	const response = await data.json()
	const dscPriceUsd = response.find((o) => o.currency === 'USD')
	const price = formatCurrency(String(dscPriceUsd?.priceAsk))
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
