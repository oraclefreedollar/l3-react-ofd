import { Address } from 'viem'

// --------------------------------------------------------------------------------
export type PositionsState = {
	error: string | null
	loaded: boolean
	list: PositionQuery[]

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

// --------------------------------------------------------------------------------
export type PositionQuery = {
	position: Address
	owner: Address
	ofd: Address
	collateral: Address
	price: string

	created: number
	isOriginal: boolean
	isClone: boolean
	denied: boolean
	closed: boolean
	original: Address

	minimumCollateral: string
	riskPremiumPPM: number
	reserveContribution: number
	start: number
	cooldown: number
	expiration: number
	challengePeriod: number

	ofdName: string
	ofdSymbol: string
	ofdDecimals: number

	collateralName: string
	collateralSymbol: string
	collateralDecimals: number
	collateralBalance: string

	//limit: string
	limitForClones: string
	availableForMinting: string
	availableForClones: string
	minted: string
}

export type ERC20Info = {
	address: Address
	name: string
	symbol: string
	decimals: number
}

// --------------------------------------------------------------------------------
export type DispatchBoolean = {
	type: string
	payload: boolean
}

export type DispatchAddressArray = {
	type: string
	payload: Address[]
}

export type DispatchPositionQueryArray = {
	type: string
	payload: PositionQuery[]
}

export type DispatchPositionQueryArray2 = {
	type: string
	payload: PositionQuery[][]
}

export type DispatchERC20InfoArray = {
	type: string
	payload: ERC20Info[]
}
