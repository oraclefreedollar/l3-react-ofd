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
}
