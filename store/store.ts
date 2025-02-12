import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { reducer as positionReducer } from './slices/positions.slice'
import { reducer as pricesReducer } from './slices/prices.slice'
import { reducer as savingsReducer } from './slices/savings.slice'
import { reducer as challengesReducer } from './slices/challenges.slice'

const rootReducer = combineReducers({
	positions: positionReducer,
	prices: pricesReducer,
	savings: savingsReducer,
	challenges: challengesReducer,
})

export const store = configureStore({
	reducer: rootReducer,
})
