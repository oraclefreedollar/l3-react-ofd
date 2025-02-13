import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { reducer as savingsReducer } from './slices/savings.slice'
import { PricesSlice } from 'store/prices'
import { ChallengesSlice } from 'store/challenges'
import { PositionsSlice } from 'store/positions'

const rootReducer = combineReducers({
	challenges: ChallengesSlice.reducer,
	positions: PositionsSlice.reducer,
	prices: PricesSlice.reducer,
	savings: savingsReducer,
})

export const store = configureStore({
	reducer: rootReducer,
})
