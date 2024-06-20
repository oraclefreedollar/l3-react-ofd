import { gql, useQuery } from "@apollo/client";

export const useOFDPSQuery = (id: string) => {
	const { data, loading } = useQuery(
		gql`
      query {
        ofdPS(id: "${id}") {
          id
          profits
          loss
          reserve
        }
      }
    `
	);

	if (!data || !data.ofdPS) {
		return {
			profit: 0n,
			loss: 0n,
		};
	}

	return {
		profit: BigInt(data.ofdPS.profits),
		loss: BigInt(data.ofdPS.loss),
	};
};
