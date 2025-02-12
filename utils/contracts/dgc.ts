import { ERC20Info } from 'store/slices/positions.types'
import { PriceQueryObjectArray } from 'store/slices/prices.types'

type DSCPRice = {
	priceAsk: string
	priceBid: string
	currency: string
	priceDate: string
}

export const dgc = async (fetchedERC20Infos: Array<ERC20Info>, fetchedPrices: PriceQueryObjectArray) => {
	const contract = '0xd9B8CF9f4FD8055c0454389dD6aAB1FDcE2E8781'.toLowerCase()
	const options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'X-AUTH-TOKEN': 'd91ad64f-4e7c-4f01-9dca-b264dd55e614',
		},
	}
	const data = await fetch('https://staging.price.denario.swiss/api/goldcoins/latest', options)
	const response = await data.json()
	const dscPriceUsd = response.find((o: DSCPRice) => o.currency === 'USD')
	const price = dscPriceUsd?.priceAsk
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
