import { Address } from 'viem'
import { useChainId, useReadContracts } from 'wagmi'
import { ABIS, ADDRESS } from 'contracts'
import { ChallengeQuery } from './useChallengeList'
import { decodeBigIntCall } from 'utils'

export interface Challenge {
	challenger: Address
	position: Address
	size: bigint
	filledSize: bigint
	index: bigint
	bidder: Address
	start: bigint
	fixedEnd: bigint
	auctionEnd: bigint
	duration: bigint
	price: bigint
	status: string
}

export const useChallengeListStats = (
	challenges: ChallengeQuery[]
): {
	challengsData: Challenge[]
	loading: boolean
} => {
	const chainId = useChainId()

	const contractCalls: any[] = []
	challenges.forEach((challenge) => {
		contractCalls.push({
			address: ADDRESS[chainId].mintingHub,
			abi: ABIS.MintingHubABI,
			functionName: 'challenges',
			args: [challenge.number],
		})
		contractCalls.push({
			address: ADDRESS[chainId].mintingHub,
			abi: ABIS.MintingHubABI,
			functionName: 'price',
			args: [challenge.number],
		})
	})
	const { data, isLoading } = useReadContracts({
		contracts: contractCalls,
	})

	const challengsData: Challenge[] = []
	if (data) {
		challenges.forEach((challenge, i) => {
			const challengeData: any[] = data[i * 2].result as any[]
			const bidder = challengeData[0]

			const price = decodeBigIntCall(data[i * 2 + 1])

			challengsData.push({
				auctionEnd: challenge.start + challenge.duration + challenge.duration,
				bidder,
				challenger: challenge.challenger,
				duration: challenge.duration,
				filledSize: challenge.filledSize,
				fixedEnd: challenge.start + challenge.duration,
				index: challenge.number,
				position: challenge.position,
				price,
				size: challenge.size,
				start: challenge.start,
				status: challenge.status,
			})
		})
	}

	return { challengsData, loading: isLoading }
}
