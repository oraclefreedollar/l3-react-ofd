import { gql, useQuery } from '@apollo/client'
import { zeroAddress } from 'viem'
import { useChainId } from 'wagmi'

export const useDelegationQuery = (owner: string) => {
	const chainId = useChainId()

	const { data, loading } = useQuery(
		gql`query GetDelegate($chainId: String!) {
      		delegation(id: "${owner}", where: { chainId: $chainId }) {
				id
				owner
				delegatedTo
				pureDelegatedFrom
      		}
    	}`,
		{ variables: { chainId: chainId.toString() } }
	)
	if (loading || !data || !data.delegation) {
		return {
			delegatedTo: zeroAddress,
			pureDelegatedFrom: [],
		}
	}

	return {
		delegatedTo: data.delegation.delegatedTo || zeroAddress,
		pureDelegatedFrom: data.delegation.pureDelegatedFrom,
	}
}
