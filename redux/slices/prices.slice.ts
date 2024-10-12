import { createSlice, Dispatch } from '@reduxjs/toolkit'
import { Address } from 'viem'
import { URI_APP_SELECTED } from 'app.config'
import { RootState } from '../redux.store'
import { ERC20Info } from './positions.types'
import { DispatchBoolean, DispatchPriceQueryObjectArray, PriceQuery, PriceQueryObjectArray, PricesState } from './prices.types'

// --------------------------------------------------------------------------------

export const initialState: PricesState = {
	error: null,
	loaded: false,

	coingecko: {},
}

// --------------------------------------------------------------------------------

export const slice = createSlice({
	name: 'prices',
	initialState,
	reducers: {
		// HAS ERROR
		hasError(state, action: { payload: string }) {
			state.error = action.payload
		},

		// SET LOADED
		setLoaded: (state, action: { payload: boolean }) => {
			state.loaded = action.payload
		},

		// -------------------------------------
		// SET COINGECKO PRICE LIST
		setList: (state, action: { payload: { [key: Address]: PriceQuery } }) => {
			state.coingecko = { ...state.coingecko, ...action.payload }
		},
	},
})

export const reducer = slice.reducer
export const actions = slice.actions

// --------------------------------------------------------------------------------
export const fetchPricesList = (state: RootState) => async (dispatch: Dispatch<DispatchBoolean | DispatchPriceQueryObjectArray>) => {
	const { mintERC20Infos, collateralERC20Infos } = state.positions
	const infos: ERC20Info[] = mintERC20Infos.concat(...collateralERC20Infos)
	if (infos.length == 0) return

	// ---------------------------------------------------------------
	// console.log("Loading [REDUX]: PricesList");

	// ---------------------------------------------------------------
	// Query from /api/details
	const response = await fetch(`${URI_APP_SELECTED}/api/prices`)
	const prices = ((await response.json())?.prices as PriceQueryObjectArray) || []

	if (Object.keys(prices).length === 0) return
	dispatch(slice.actions.setList(prices))

	// ---------------------------------------------------------------
	// Finalizing, loaded set to ture
	dispatch(slice.actions.setLoaded(true))
}
