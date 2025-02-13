import { RootState } from 'store/types'
import { createSelector } from 'reselect'

export const _getState = (state: RootState) => state.positions

const getList = createSelector(_getState, (state) => state.list)

const getOpenPositions = createSelector(_getState, (state) => state.openPositions)

const getOpenPositionsByCollateral = createSelector(_getState, (state) => state.openPositionsByCollateral)

const getMintERC20Infos = createSelector(_getState, (state) => state.mintERC20Infos)

const getCollateralERC20Infos = createSelector(_getState, (state) => state.collateralERC20Infos)

const isLoaded = createSelector(_getState, (state) => state.loaded)

export const PositionsSelectors = {
	getCollateralERC20Infos,
	getList,
	getMintERC20Infos,
	getOpenPositions,
	getOpenPositionsByCollateral,
	isLoaded,
}
