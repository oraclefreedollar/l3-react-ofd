import { createSlice } from '@reduxjs/toolkit'

import { initialState } from 'store/savings/state'
import { getAll } from 'store/savings/actions/getAll'

export const SavingsSlice = createSlice({
	name: 'savings',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getAll.pending, (state) => {
			state.loaded = false
		})
		builder.addCase(getAll.fulfilled, (state, action) => {
			if (action.payload) {
				const { account } = action.meta.arg
				const { allUsersData, leadrateInfo, leadrateRate, leadrateProposed, savingsInfo, userData } = action.payload
				if (account) {
					state.savingsUserTable = userData
				} else {
					state.savingsUserTable = initialState.savingsUserTable
				}
				state.leadrateInfo = leadrateInfo
				state.leadrateRate = leadrateRate
				state.leadrateProposed = leadrateProposed
				state.savingsInfo = savingsInfo
				state.savingsAllUserTable = allUsersData
				state.loaded = true
			}
		})
		builder.addCase(getAll.rejected, (state, action) => {
			state.error = action.error.message || 'Savings slice error'
		})
	},
})
