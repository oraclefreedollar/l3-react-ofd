import { createSlice } from '@reduxjs/toolkit'

import { initialState } from 'store/positions/state'
import { getAll } from 'store/positions/actions/getAll'

export const PositionsSlice = createSlice({
	name: 'positions',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getAll.fulfilled, (state, action) => {
			const {
				closedPositions,
				collateralAddresses,
				collateralERC20Infos,
				deniedPositions,
				list,
				mintERC20Infos,
				openPositions,
				openPositionsByOriginal,
				openPositionsByCollateral,
				originalPositions,
			} = action.payload

			if (state.list.length < list.length) {
				state.list = list
			}
			if (state.openPositions.length < openPositions.length) {
				state.openPositions = openPositions
			}
			if (state.closedPositions.length < closedPositions.length) {
				state.closedPositions = closedPositions
			}
			if (state.deniedPositions.length < deniedPositions.length) {
				state.deniedPositions = deniedPositions
			}
			if (state.originalPositions.length < originalPositions.length) {
				state.originalPositions = originalPositions
			}
			if (state.openPositionsByOriginal.length < openPositionsByOriginal.length) {
				state.openPositionsByOriginal = openPositionsByOriginal
			}
			if (state.openPositionsByCollateral.length < openPositionsByCollateral.length) {
				state.openPositionsByCollateral = openPositionsByCollateral
			}
			if (state.mintERC20Infos.length < mintERC20Infos.length) {
				state.mintERC20Infos = mintERC20Infos
			}
			if (state.collateralAddresses.length < collateralAddresses.length) {
				state.collateralAddresses = collateralAddresses
			}
			if (state.collateralERC20Infos.length < collateralERC20Infos.length) {
				state.collateralERC20Infos = collateralERC20Infos
			}

			state.loaded = true
		})
		builder.addCase(getAll.rejected, (state, action) => {
			state.error = `${action.error.message}`
		})
	},
})
