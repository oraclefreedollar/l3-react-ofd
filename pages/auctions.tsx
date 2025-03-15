import Head from 'next/head'
import { zeroAddress } from 'viem'
import { useChallengeListStats, useChallengeLists } from 'hooks'
import { useAccount } from 'wagmi'
import AppPageHeader from 'components/AppPageHeader'
import ChallengeTable from 'components/ChallengeTable'
import { envConfig } from 'app.env.config'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { InferGetServerSidePropsType } from 'next'
import { withServerSideTranslations } from 'utils/withServerSideTranslations'

const namespaces = ['auctions', 'challenge']

const Auction: React.FC = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { t } = useTranslation(namespaces)

	const { address } = useAccount()
	const { challenges, loading: queryLoading } = useChallengeLists({})
	const { challengsData, loading } = useChallengeListStats(challenges)
	const account = address || zeroAddress

	return (
		<>
			<Head>
				<title>
					{envConfig.AppName} - {t('auctions:title')}
				</title>
			</Head>
			<div>
				<AppPageHeader title={t('auctions:header:yourAuctions')} />
				<ChallengeTable
					challenges={challengsData.filter((challenge) => challenge.challenger == account)}
					loading={loading || queryLoading}
					noContentText={t('auctions:noContent:yourAuctions')}
				/>

				<AppPageHeader className="mt-8" title={t('auctions:header:allAuctions')} />
				<ChallengeTable
					challenges={challengsData.filter((challenge) => challenge.challenger != account)}
					loading={loading || queryLoading}
					noContentText={t('auctions:noContent:allAuctions')}
				/>
			</div>
		</>
	)
}

export const getServerSideProps = withServerSideTranslations(namespaces)

export default Auction
