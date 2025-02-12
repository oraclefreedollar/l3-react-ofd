import { createSlice } from '@reduxjs/toolkit'

import { initialState } from 'store/prices/state'
import { update } from 'store/prices/actions/update'

export const PricesSlice = createSlice({
	name: 'prices',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(update.pending, (state) => {
			state.loaded = false
		})
		builder.addCase(update.fulfilled, (state, action) => {
			if (action.payload) {
				state.coingecko = { ...state.coingecko, ...action.payload }
			}
			state.loaded = true
		})
		builder.addCase(update.rejected, (state) => {
			state.loaded = false
		})
	},
})
