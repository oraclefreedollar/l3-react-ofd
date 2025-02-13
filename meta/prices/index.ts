import { ERC20Info } from 'meta/positions'

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
