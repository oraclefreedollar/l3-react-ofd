import { ABIS, ADDRESS } from 'contracts'
import { decodeBigIntCall } from 'utils'
import { zeroAddress } from 'viem'
import { useAccount, useChainId, useReadContracts } from 'wagmi'

export const usePoolStats: () => {
	equityUserVotes: bigint
	ofdMinterReserve: bigint
	equityHoldingDuration: bigint
	equityBalance: bigint
	equityCanRedeem: boolean
	refetch: any
	ofdTotalReserve: bigint
	ofdAllowance: bigint
	ofdEquity: bigint
	equityTotalVotes: bigint
	equityPrice: bigint
	equitySupply: bigint
	ofdBalance: bigint
} = () => {
	const chainId = useChainId()
	const { address } = useAccount()
	const account = address || zeroAddress

	const equityContract = {
		address: ADDRESS[chainId].equity,
		abi: ABIS.EquityABI,
	}

	const ofdContract = {
		address: ADDRESS[chainId].oracleFreeDollar,
		abi: ABIS.oracleFreeDollarABI,
	}

	const { data, refetch } = useReadContracts({
		contracts: [
			// Equity Calls
			{
				...equityContract,
				functionName: 'totalSupply',
			},
			{
				...equityContract,
				functionName: 'price',
			},
			{
				...equityContract,
				functionName: 'balanceOf',
				args: [account],
			},
			{
				...equityContract,
				functionName: 'totalVotes',
			},
			{
				...equityContract,
				functionName: 'votes',
				args: [account],
			},
			{
				...equityContract,
				functionName: 'canRedeem',
				args: [account],
			},
			{
				...equityContract,
				functionName: 'holdingDuration',
				args: [account],
			},
			// oracleFreeDollar Calls
			{
				...ofdContract,
				functionName: 'minterReserve',
			},
			{
				...ofdContract,
				functionName: 'equity',
			},
			{
				...ofdContract,
				functionName: 'balanceOf',
				args: [account],
			},
			{
				...ofdContract,
				functionName: 'allowance',
				args: [account, ADDRESS[chainId].equity],
			},
		],
	})

	const equitySupply: bigint = data ? decodeBigIntCall(data[0]) : 0n
	const equityPrice: bigint = data ? decodeBigIntCall(data[1]) : 0n
	const equityBalance: bigint = data ? decodeBigIntCall(data[2]) : 0n
	const equityTotalVotes: bigint = data ? decodeBigIntCall(data[3]) : 0n
	const equityUserVotes: bigint = data ? decodeBigIntCall(data[4]) : 0n
	const equityCanRedeem: boolean = data ? Boolean(data[5].result) : false
	const equityHoldingDuration: bigint = data ? decodeBigIntCall(data[6]) : 0n

	const ofdMinterReserve: bigint = data ? decodeBigIntCall(data[7]) : 0n
	const ofdEquity: bigint = data ? decodeBigIntCall(data[8]) : 0n
	const ofdTotalReserve = ofdMinterReserve + ofdEquity
	const ofdBalance: bigint = data ? decodeBigIntCall(data[9]) : 0n
	const ofdAllowance: bigint = data ? decodeBigIntCall(data[10]) : 0n

	return {
		equityBalance,
		equityCanRedeem,
		equityHoldingDuration,
		equityPrice,
		equitySupply,
		equityTotalVotes,
		equityUserVotes,
		ofdAllowance,
		ofdBalance,
		ofdEquity,
		ofdMinterReserve,
		ofdTotalReserve,
		refetch,
	}
}
