import { Address } from 'viem'
import { ERC20Info, PositionQuery } from 'meta/positions'

export type PositionsState = {
	error: string | null
	list: Array<PositionQuery>
	loaded: boolean

	openPositions: PositionQuery[]
	closedPositions: PositionQuery[]
	deniedPositions: PositionQuery[]
	originalPositions: PositionQuery[]
	openPositionsByOriginal: PositionQuery[][]
	openPositionsByCollateral: PositionQuery[][]

	collateralAddresses: Address[]
	collateralERC20Infos: ERC20Info[]
	mintERC20Infos: ERC20Info[]
}

export const initialState: PositionsState = {
	error: null,
	list: [],
	loaded: false,

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
