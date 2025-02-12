import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { reducer as positionReducer } from './slices/positions.slice'
import { reducer as savingsReducer } from './slices/savings.slice'
import { reducer as challengesReducer } from './slices/challenges.slice'
import { PricesSlice } from 'store/prices'

const rootReducer = combineReducers({
	positions: positionReducer,
	prices: PricesSlice.reducer,
	savings: savingsReducer,
	challenges: challengesReducer,
})

export const store = configureStore({
	reducer: rootReducer,
})
