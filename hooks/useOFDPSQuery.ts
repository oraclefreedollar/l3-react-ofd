import { gql, useQuery } from '@apollo/client'

export const useOFDPSQuery = (id: string) => {
	const { data } = useQuery(
		gql`
      query {
        oFDPS(id: "${id}") {
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
