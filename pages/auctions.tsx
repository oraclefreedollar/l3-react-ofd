import Head from 'next/head'
import { zeroAddress } from 'viem'
import { useChallengeListStats, useChallengeLists } from 'hooks'
import { useAccount } from 'wagmi'
import AppPageHeader from 'components/AppPageHeader'
import ChallengeTable from 'components/ChallengeTable'
import { envConfig } from 'app.env.config'

export default function Auction({}) {
	const { address } = useAccount()
	const { challenges, loading: queryLoading } = useChallengeLists({})
	const { challengsData, loading } = useChallengeListStats(challenges)
	const account = address || zeroAddress

	return (
		<>
			<Head>
				<title>{envConfig.AppName} - Auctions</title>
			</Head>
			<div>
				<AppPageHeader title="Your Auctions" />
				<ChallengeTable
					challenges={challengsData.filter((challenge) => challenge.challenger == account)}
					loading={loading || queryLoading}
					noContentText="You don't have any auction."
				/>

				<AppPageHeader className="mt-8" title="All Auctions" />
				<ChallengeTable
					challenges={challengsData.filter((challenge) => challenge.challenger != account)}
					loading={loading || queryLoading}
					noContentText="There are no auctions yet."
				/>
			</div>
		</>
	)
}
