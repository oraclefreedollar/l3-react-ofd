import { PriceQueryObjectArray } from 'meta/prices'

export type PricesState = {
	coingecko: PriceQueryObjectArray
	loaded: boolean
}

export const initialState: PricesState = {
	coingecko: {},
	loaded: false,
}
