import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { PricesSlice } from 'store/prices'
import { ChallengesSlice } from 'store/challenges'
import { PositionsSlice } from 'store/positions'
import { SavingsSlice } from 'store/savings'

const rootReducer = combineReducers({
	challenges: ChallengesSlice.reducer,
	positions: PositionsSlice.reducer,
	prices: PricesSlice.reducer,
	savings: SavingsSlice.reducer,
})

export const store = configureStore({
	reducer: rootReducer,
})
