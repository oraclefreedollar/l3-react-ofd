import { createSlice, Dispatch } from '@reduxjs/toolkit'
import { uniqueValues } from 'utils'
import { Address } from 'viem'
import { fetchPositions } from 'pages/api/positions'
import {
	DispatchAddressArray,
	DispatchBoolean,
	DispatchERC20InfoArray,
	DispatchPositionQueryArray,
	DispatchPositionQueryArray2,
	ERC20Info,
	PositionQuery,
	PositionsState,
} from './positions.types'

// --------------------------------------------------------------------------------

export const initialState: PositionsState = {
	error: null,
	loaded: false,
	list: [],

	openPositions: [],
	closedPositions: [],
	deniedPositions: [],
	originalPositions: [],
	openPositionsByOriginal: [],
	openPositionsByCollateral: [],

	collateralAddresses: [],
	collateralERC20Infos: [],
	mintERC20Infos: [],
}

// --------------------------------------------------------------------------------
export const slice = createSlice({
	name: 'positions',
	initialState,
	reducers: {
		// HAS ERROR
		hasError(state, action: { payload: string }) {
			state.error = action.payload
		},

		// SET LOADED
		setLoaded: (state, action: { payload: boolean }) => {
			state.loaded = action.payload
		},

		// -------------------------------------
		// SET LIST
		setList: (state, action: { payload: PositionQuery[] }) => {
			if (state.list.length >= action.payload.length) return
			state.list = action.payload
		},

		// SET OPEN POSITIONS
		setOpenPositions: (state, action: { payload: PositionQuery[] }) => {
			if (state.openPositions.length >= action.payload.length) return
			state.openPositions = action.payload
		},

		// SET CLOSED POSITIONS
		setClosedPositions: (state, action: { payload: PositionQuery[] }) => {
			if (state.closedPositions.length >= action.payload.length) return
			state.closedPositions = action.payload
		},

		// SET DENIED POSITIONS
		setDeniedPositions: (state, action: { payload: PositionQuery[] }) => {
			if (state.deniedPositions.length >= action.payload.length) return
			state.deniedPositions = action.payload
		},

		// SET ORIGINAL POSITIONS
		setOriginalPositions: (state, action: { payload: PositionQuery[] }) => {
			if (state.originalPositions.length >= action.payload.length) return
			state.originalPositions = action.payload
		},

		// SET OPEN POSITIONS BY ORIGINAL
		setOpenPositionsByOriginal: (state, action: { payload: PositionQuery[][] }) => {
			if (state.openPositionsByOriginal.length >= action.payload.length) return
			state.openPositionsByOriginal = action.payload
		},

		// SET OPEN POSITIONS BY COLLATERAL
		setOpenPositionsByCollateral: (state, action: { payload: PositionQuery[][] }) => {
			if (state.openPositionsByCollateral.length >= action.payload.length) return
			state.openPositionsByCollateral = action.payload
		},

		// -------------------------------------
		// SET COLLATERAL ADDRESSES
		setCollateralAddresses: (state, action: { payload: Address[] }) => {
			if (state.collateralAddresses.length >= action.payload.length) return
			state.collateralAddresses = action.payload
		},

		// SET COLLATERAL ERC20 INFO
		setCollateralERC20Infos: (state, action: { payload: ERC20Info[] }) => {
			if (state.collateralERC20Infos.length >= action.payload.length) return
			state.collateralERC20Infos = action.payload
		},

		// SET Mint ERC20 INFO
		setMintERC20Infos: (state, action: { payload: ERC20Info[] }) => {
			if (state.mintERC20Infos.length >= action.payload.length) return
			state.mintERC20Infos = action.payload
		},
	},
})

export const reducer = slice.reducer
export const actions = slice.actions

// --------------------------------------------------------------------------------
export const fetchPositionsList =
	() =>
	async (
		dispatch: Dispatch<
			DispatchBoolean | DispatchPositionQueryArray | DispatchPositionQueryArray2 | DispatchAddressArray | DispatchERC20InfoArray
		>
	) => {
		// ---------------------------------------------------------------
		// console.log("Loading [REDUX]: PositionsList");

		// ---------------------------------------------------------------
		// Query raw data from Ponder Indexer
		const list = await fetchPositions()
		// console.log(list);
		dispatch(slice.actions.setList(list))

		// ---------------------------------------------------------------
		// filter positions and dispatch
		const openPositions = list.filter((position) => !position.denied && !position.closed)
		const collateralAddresses = openPositions.map((position) => position.collateral).filter(uniqueValues)

		const closedPositions = list.filter((position) => position.closed)
		const deniedPositions = list.filter((position) => position.denied)
		const originalPositions = openPositions.filter((position) => position.isOriginal)
		const openPositionsByOriginal = originalPositions.map((o) => openPositions.filter((p) => p.original == o.original))
		const openPositionsByCollateral = collateralAddresses.map((con) => openPositions.filter((position) => position.collateral == con))

		dispatch(slice.actions.setOpenPositions(openPositions))
		dispatch(slice.actions.setClosedPositions(closedPositions))
		dispatch(slice.actions.setDeniedPositions(deniedPositions))
		dispatch(slice.actions.setOriginalPositions(originalPositions))
		dispatch(slice.actions.setOpenPositionsByOriginal(openPositionsByOriginal))
		dispatch(slice.actions.setOpenPositionsByCollateral(openPositionsByCollateral))

		// ---------------------------------------------------------------
		// filter collateral and ERC20 and dispatch
		// TODO: Change hardcoded OFD Info (ofdERC20Info), if adding additional currencies dynamically is needed.
		const mintERC20Infos: ERC20Info[] = [
			{
				address: originalPositions.at(0)!.ofd,
				name: originalPositions.at(0)!.ofdName,
				symbol: originalPositions.at(0)!.ofdSymbol,
				decimals: originalPositions.at(0)!.ofdDecimals,
			},
		]
		const collateralERC20Info = collateralAddresses.map((c): ERC20Info => {
			const pos = originalPositions.filter((p) => p.collateral == c).at(0)
			return {
				address: c,
				name: pos!.collateralName,
				symbol: pos!.collateralSymbol,
				decimals: pos!.collateralDecimals,
			}
		})

		dispatch(slice.actions.setCollateralAddresses(collateralAddresses))
		dispatch(slice.actions.setCollateralERC20Infos(collateralERC20Info))
		dispatch(slice.actions.setMintERC20Infos(mintERC20Infos))

		// ---------------------------------------------------------------
		// Finalizing, loaded set to true
		dispatch(slice.actions.setLoaded(true))
	}
