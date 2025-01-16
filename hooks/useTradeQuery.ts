import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client'

interface TradeChart {
    id: string
    lastPrice: string
    time: string
}

// Client for the old subgraph
const oldSubgraphClient = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_URI_PONDER_DEVELOPER_V1,
    cache: new InMemoryCache()
})

export const useTradeQuery = (): {
    loading: boolean
    trades: TradeChart[]
} => {
    const { data, loading } = useQuery(
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
        `
    )

    if (!data || !data.tradeCharts) {
        return {
            loading,
            trades: [],
        }
    }

    return {
        loading,
        trades: data.tradeCharts.items,
    }
}

// Query from the old subgraph
export const useTradeQueryOld = (): {
    loading: boolean
    oldTrades: TradeChart[]
} => {
    const { data, loading } = useQuery(
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
            oldTrades: [],
        }
    }

    return {
        loading,
        oldTrades: data.tradeCharts.items,
    }
}