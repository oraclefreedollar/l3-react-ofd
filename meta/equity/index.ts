import { RefetchType } from 'utils'

export type EquityPoolStats = {
	equityBalance: bigint
	equityCanRedeem: boolean
	equityHoldingDuration: bigint
	equityPrice: bigint
	equitySupply: bigint
	equityTotalVotes: bigint
	equityUserVotes: bigint
	ofdAllowance: bigint
	ofdBalance: bigint
	ofdEquity: bigint
	ofdMinterReserve: bigint
	ofdTotalReserve: bigint
	refetch: RefetchType
}
