import { createSlice } from '@reduxjs/toolkit'

import { initialState } from 'store/challenges/state'
import { getAll } from 'store/challenges/actions/getAll'

export const ChallengesSlice = createSlice({
	name: 'challenges',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getAll.pending, (state) => {
			state.loaded = false
		})
		builder.addCase(getAll.fulfilled, (state, action) => {
			if (action.payload) {
				state.list = action.payload.list
				state.mapping = action.payload.mapping
				state.challengers = action.payload.challengers
				state.positions = action.payload.positions
				state.challengesPrices = action.payload.challengesPrices
				state.loaded = true
			}
		})
		builder.addCase(getAll.rejected, (state, action) => {
			state.loaded = false
			state.error = `Error fetching challenges: ${action.error.message}`
		})
	},
})
