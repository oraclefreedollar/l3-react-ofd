import { gql, useQuery } from '@apollo/client'
import { useChainId } from 'wagmi'

export const useMinterQuery = () => {
	const chainId = useChainId()
	const { data, loading } = useQuery(
		gql`
			query GetMinter($chainId: String!) {
				minters(orderBy: "applyDate", orderDirection: "desc", where: { chainId: $chainId }) {
					items {
						id
						minter
						applicationPeriod
						applicationFee
						applyMessage
						applyDate
						suggestor
						denyMessage
						denyDate
						vetor
					}
				}
			}
		`,
		{
			variables: { chainId: chainId.toString() },
		}
	)

	if (!data || !data.minters) {
		return {
			loading,
			minters: [],
		}
	}

	return {
		loading,
		minters: data.minters.items,
	}
}
