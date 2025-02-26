import Head from 'next/head'
import React, { useEffect } from 'react'
import { useAppDispatch } from 'store'
import MonitoringTable from 'components/Monitoring/MonitoringTable'
import AppPageHeader from 'components/AppPageHeader'
import { withServerSideTranslations } from 'utils/withServerSideTranslations'
import { InferGetServerSidePropsType } from 'next'
import { useTranslation } from 'next-i18next'
import { envConfig } from 'app.env.config'
import { ChallengesActions } from 'store/challenges'
import { PositionsActions } from 'store/positions'
import { useChainId } from 'wagmi'

const namespaces = ['monitoring']

const Monitoring: React.FC = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const dispatch = useAppDispatch()
	const { t } = useTranslation(namespaces)
	const chainId = useChainId()

	useEffect(() => {
		dispatch(PositionsActions.getAll({ chainId }))
		dispatch(ChallengesActions.getAll())
	}, [dispatch, chainId])

	return (
		<>
			<Head>
				<title>
					{envConfig.AppName} - {t('monitoring:title')}
				</title>
			</Head>

			<AppPageHeader title={t('monitoring:title')} />
			<div className="md:mt-8">
				<MonitoringTable />
			</div>
		</>
	)
}

export const getServerSideProps = withServerSideTranslations(namespaces)

export default Monitoring
