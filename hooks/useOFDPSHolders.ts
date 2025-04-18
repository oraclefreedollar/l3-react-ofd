import { gql, useQuery } from '@apollo/client'
import { Address } from 'viem'
import { useChainId } from 'wagmi'

export interface OFDPSHolder {
	id: string
	address: Address
	votingPower: bigint
}

export const useOFDPSHolders = (): {
	loading: boolean
	holders: OFDPSHolder[]
} => {
	const chainId = useChainId()

	const { data, loading } = useQuery(gql`
		query {
			votingPowers(orderBy: "votingPower", orderDirection: "desc", limit: 25, where: { chainId: "${chainId}" }) {
				items {
					id
					address
					votingPower
				}
			}
		}
	`)

	if (!data || !data.votingPowers) {
		return {
			loading,
			holders: [],
		}
	}

	return {
		loading,
		holders: data.votingPowers.items,
	}
}
