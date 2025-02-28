import { gql, useQuery } from '@apollo/client'
import { useChainId } from 'wagmi'

export const useOFDPSQuery = () => {
	const chainId = useChainId()
	const { data } = useQuery(
		gql`
      query {
        oFDPSs(where: { chainId: "${chainId}" }) {
    			items {
						id
						profits
						loss
						reserve  
					}			
        }
      }
    `
	)

	if (!data || !data.oFDPSs) {
		return {
			profit: 0n,
			loss: 0n,
		}
	}

	return {
		profit: BigInt(data.oFDPSs.items[0].profits),
		loss: BigInt(data.oFDPSs.items[0].loss),
	}
}
