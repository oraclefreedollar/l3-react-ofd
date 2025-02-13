import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { reducer as positionReducer } from './slices/positions.slice'
import { reducer as savingsReducer } from './slices/savings.slice'
import { PricesSlice } from 'store/prices'
import { ChallengesSlice } from 'store/challenges'

const rootReducer = combineReducers({
	challenges: ChallengesSlice.reducer,
	positions: positionReducer,
	prices: PricesSlice.reducer,
	savings: savingsReducer,
})

export const store = configureStore({
	reducer: rootReducer,
})
