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
