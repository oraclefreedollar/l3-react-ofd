import { Address } from 'viem'
import { RefetchType } from 'utils'

export type PositionCollateralTokenData = {
	address: Address
	allowance: bigint
	balance: bigint
	decimals: bigint
	name: string
	refetch: RefetchType
	symbol: string
	totalSupply: bigint
}

export type PositionStats = {
	annualInterestPPM: bigint
	available: bigint
	challengePeriod: bigint
	closed: boolean
	collateral: `0x${string}` | undefined
	collateralAllowance: bigint
	collateralBal: bigint
	collateralDecimal: number
	collateralPosAllowance: bigint
	collateralSymbol: string
	collateralUserBal: bigint
	cooldown: bigint
	denied: boolean
	expiration: bigint
	isSuccess: boolean
	limit: bigint
	limitForClones: bigint
	liqPrice: bigint
	minimumCollateral: bigint
	minted: bigint
	mintingFee: bigint
	ofdAllowance: bigint
	ofdBalance: bigint
	owner: `0x${string}`
	refetch: any
	reserveContribution: bigint
}

export type ERC20Info = {
	address: Address
	name: string
	symbol: string
	decimals: number
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
