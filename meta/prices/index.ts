import { ERC20Info } from 'store/slices/positions.types'

export type PriceQueryCurrencies = {
	usd: number
	// chf: number;
	// eur: number;
}

export type PriceQuery = ERC20Info & {
	timestamp: number
	price: PriceQueryCurrencies
}

export type PriceQueryObjectArray = Record<string, PriceQuery>
