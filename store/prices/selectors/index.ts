import { RootState } from 'store/types'
import { createSelector } from 'reselect'

export const _getState = (state: RootState) => state.prices

const getCoingeckoPrices = createSelector(_getState, (state) => state.coingecko)

const getPricesLoaded = createSelector(_getState, (state) => state.loaded)

export const PricesSelectors = {
	getCoingeckoPrices,
	getPricesLoaded,
}
