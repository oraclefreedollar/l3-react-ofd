import { RootState } from 'store/types'
import { createSelector } from 'reselect'

const _getState = (state: RootState) => state.challenges

const getPositions = createSelector(_getState, (state) => state.positions)

export const ChallengesSelectors = {
	getPositions,
}
