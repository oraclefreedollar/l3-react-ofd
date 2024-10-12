import { ABIS, ADDRESS } from 'contracts'
import { decodeBigIntCall } from 'utils'
import { Address, zeroAddress } from 'viem'
import { useAccount, useChainId, useReadContracts } from 'wagmi'

export const useGovStats: (helpers?: Address[]) => {
	userVotes: bigint
	totalVotes: bigint
	delegatedFrom: { owner: Address; votes: bigint }[]
	refetch: any
	userTotalVotes: bigint
} = (helpers?: Address[]) => {
	const chainId = useChainId()
	const { address } = useAccount()

	const equityContract = {
		address: ADDRESS[chainId].equity,
		abi: ABIS.EquityABI,
	}

	const account = address || zeroAddress
	const contractCalls: any[] = [
		{
			...equityContract,
			functionName: 'totalVotes',
		},
		{
			...equityContract,
			functionName: 'votes',
			args: [account],
		},
	]

	helpers?.forEach((helper) => {
		contractCalls.push({
			...equityContract,
			functionName: 'votes',
			args: [helper],
		})
	})

	// Fetch all blockchain stats in one web3 call using multicall
	const { data, refetch } = useReadContracts({
		contracts: contractCalls,
	})

	const totalVotes: bigint = data ? decodeBigIntCall(data[0]) : BigInt(0)
	const userVotes: bigint = data ? decodeBigIntCall(data[1]) : BigInt(0)
	const delegatedFrom: { owner: Address; votes: bigint }[] = []
	let userTotalVotes = userVotes
	helpers?.forEach((helper, i) => {
		const delegatorVotes = data ? decodeBigIntCall(data[i + 2]) : BigInt(0)
		delegatedFrom.push({
			owner: helper,
			votes: delegatorVotes,
		})
		userTotalVotes += delegatorVotes
	})

	return {
		delegatedFrom,
		refetch,
		totalVotes,
		userTotalVotes,
		userVotes,
	}
}
