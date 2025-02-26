import { RootState } from 'store/types'
import { createSelector } from 'reselect'

export const _getState = (state: RootState) => state.savings

const getLeadrateInfo = createSelector(_getState, (state) => state.leadrateInfo)

const getLeadrateProposed = createSelector(_getState, (state) => state.leadrateProposed)

const getLeadrateRate = createSelector(_getState, (state) => state.leadrateRate)

const getSavingsAllUserTable = createSelector(_getState, (state) => state.savingsAllUserTable)

const getSavingsInfo = createSelector(_getState, (state) => state.savingsInfo)

export const SavingsSelectors = {
	getLeadrateInfo,
	getLeadrateProposed,
	getLeadrateRate,
	getSavingsAllUserTable,
	getSavingsInfo,
}
