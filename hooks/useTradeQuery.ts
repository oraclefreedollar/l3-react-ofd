import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client'
import { useChainId } from 'wagmi'

interface TradeChart {
	id: string
	lastPrice: string
	time: string
}

// Client for the old subgraph
const oldSubgraphClient = new ApolloClient({
	uri: process.env.NEXT_PUBLIC_URI_PONDER_DEVELOPER_V1,
	cache: new InMemoryCache(),
})

export const useTradeQuery = (): {
	loading: boolean
	refetch: any
	trades: TradeChart[]
} => {
	const chainId = useChainId()
	const { data, loading, refetch } = useQuery(
		gql`
			query GetTradeCharts($chainId: String!) {
				tradeCharts(orderDirection: "desc", orderBy: "time", where: { chainId: $chainId }, limit: 100) {
					items {
						id
						lastPrice
						time
					}
				}
			}
		`,
		{ variables: { chainId: chainId.toString() } }
	)

	if (!data || !data.tradeCharts) {
		return {
			loading,
			refetch,
			trades: [],
		}
	}

	return {
		loading,
		refetch,
		trades: data.tradeCharts.items,
	}
}

// Query from the old subgraph
export const useTradeQueryOld = (): {
	loading: boolean
	refetch: any
	oldTrades: TradeChart[]
} => {
	const chainId = useChainId()
	const { data, loading, refetch } = useQuery(
		gql`
			query {
				tradeCharts(orderDirection: "desc", orderBy: "time", limit: 100) {
					items {
						id
						lastPrice
						time
					}
				}
			}
		`,
		{ client: oldSubgraphClient }
	)

	if (!data || !data.tradeCharts) {
		return {
			loading,
			refetch,
			oldTrades: [],
		}
	}

	return {
		loading,
		refetch,
		oldTrades: data.tradeCharts.items,
	}
}
