import Head from 'next/head'
import React, { useEffect } from 'react'
import { store } from 'redux/redux.store'
import { fetchPositionsList } from 'redux/slices/positions.slice'
import { fetchChallengesList } from 'redux/slices/challenges.slice'
import MonitoringTable from 'components/Monitoring/MonitoringTable'
import AppPageHeader from 'components/AppPageHeader'
import { withServerSideTranslations } from 'utils/withServerSideTranslations'
import { InferGetServerSidePropsType } from 'next'
import { useTranslation } from 'next-i18next'
import { envConfig } from 'app.env.config'

const namespaces = ['monitoring']

const Monitoring: React.FC = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { t } = useTranslation(namespaces)

	useEffect(() => {
		store.dispatch(fetchPositionsList())
		store.dispatch(fetchChallengesList())
	}, [])

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
