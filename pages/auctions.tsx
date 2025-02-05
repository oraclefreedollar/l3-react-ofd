import Head from 'next/head'
import { zeroAddress } from 'viem'
import { useChallengeListStats, useChallengeLists } from 'hooks'
import { useAccount } from 'wagmi'
import AppPageHeader from 'components/AppPageHeader'
import ChallengeTable from 'components/ChallengeTable'
import { envConfig } from 'app.env.config'
import { useTranslation } from 'next-i18next'

export default function Auction({}) {
	const { t } = useTranslation()

	const { address } = useAccount()
	const { challenges, loading: queryLoading } = useChallengeLists({})
	const { challengsData, loading } = useChallengeListStats(challenges)
	const account = address || zeroAddress

	return (
		<>
			<Head>
				<title>
					{envConfig.AppName} - {t('pages:auctions:title')}
				</title>
			</Head>
			<div>
				<AppPageHeader title={t('pages:auctions:header:yourAuctions')} />
				<ChallengeTable
					challenges={challengsData.filter((challenge) => challenge.challenger == account)}
					loading={loading || queryLoading}
					noContentText={t('pages:auctions:noContent:yourAuctions')}
				/>

				<AppPageHeader className="mt-8" title={t('pages:auctions:header:allAuctions')} />
				<ChallengeTable
					challenges={challengsData.filter((challenge) => challenge.challenger != account)}
					loading={loading || queryLoading}
					noContentText={t('pages:auctions:noContent:allAuctions')}
				/>
			</div>
		</>
	)
}
