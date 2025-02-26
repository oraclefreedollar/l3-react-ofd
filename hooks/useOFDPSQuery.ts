import { gql, useQuery } from '@apollo/client'
import { useChainId } from 'wagmi'

export const useOFDPSQuery = (id: string) => {
	const chainId = useChainId()
	const { data } = useQuery(
		gql`
      query {
        oFDPS(id: "${id}", where: { chainId: "${chainId}" }) {
          id
          profits
          loss
          reserve
        }
      }
    `
	)

	if (!data || !data.oFDPS) {
		return {
			profit: 0n,
			loss: 0n,
		}
	}

	return {
		profit: BigInt(data.oFDPS.profits),
		loss: BigInt(data.oFDPS.loss),
	}
}
